// server/services/profileService.js
import { supabase } from '../db/supabaseClient.js';

/**
 * Retrieves a user profile from the database.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<object>} A promise that resolves to the user profile data.
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // code for returning 0 rows in single()
        throw new Error(`Profile for user ID ${userId} not found.`);
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Updates a user profile in the database.
 * @param {string} userId - The UUID of the user to update.
 * @param {object} updates - An object containing the fields to update (e.g., { xp: 100, level: 2 }).
 * @returns {Promise<object>} A promise that resolves to the updated user profile data.
 */
export async function updateUserProfile(userId, updates) {
  const allowedUpdates = [
    'self_awareness_score',
    'enlightenment_score',
    'self_reliance_score',
    'altruism_score',
    'xp',
    'level',
  ];
  const updateKeys = Object.keys(updates).filter(key => allowedUpdates.includes(key));

  if (updateKeys.length === 0) {
    throw new Error('No valid fields to update.');
  }

  // Construct update object
  const updatePayload = {};
  updateKeys.forEach(key => {
    updatePayload[key] = updates[key];
  });

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updatePayload)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Profile for user ID ${userId} not found.`);

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Retrieves a leaderboard of users, sorted by experience points and then level.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of user profiles, sorted by XP and level.
 */
export async function calculateLeaderboard() {
  try {
    // JOIN users u INNER JOIN user_profiles up
    // Supabase: user_profiles inner join users
    const { data, error } = await supabase
      .from('user_profiles')
      .select('xp, level, users!inner(id, email)')
      .order('xp', { ascending: false })
      .order('level', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Flatten result to match original { id, email, xp, level }
    const leaderboard = data.map((item) => {
      const user = Array.isArray(item.users) ? item.users[0] : item.users;
      return {
        id: user?.id,
        email: user?.email,
        xp: item.xp,
        level: item.level
      };
    });

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
