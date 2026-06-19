import { supabase } from '../db/supabaseClient.js';

/**
 * Retrieves all available tasks from the database.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of tasks.
 */
export async function getAllTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw error;
  }
}

/**
 * Retrieves a specific task from the database.
 * @param {number} taskId - The ID of the task to retrieve.
 * @returns {Promise<object>} A promise that resolves to the task data.
 */
export async function getTask(taskId) {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Task with ID ${taskId} not found.`);

    return data;
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

/**
 * Completes a task for a user and awards the XP and pillar score.
 * @param {string} userId - The UUID of the user completing the task.
 * @param {number} taskId - The ID of the task being completed.
 * @returns {Promise<object>} A promise that resolves to the updated user profile.
 */
export async function completeTask(userId, taskId) {
  try {
    // 1. Check if the user has already completed the task
    const { data: existingTask, error: checkError } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_id', taskId);

    if (checkError) throw checkError;
    if (existingTask && existingTask.length > 0) {
      throw new Error(`User ${userId} has already completed task ${taskId}.`);
    }

    // 2. Get the task details
    const task = await getTask(taskId);

    // 3. Create a new user_task record
    const { error: insertError } = await supabase
      .from('user_tasks')
      .insert({
        user_id: userId,
        task_id: taskId,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

    if (insertError) throw insertError;

    // 4. Map pillar name to database column
    const pillarMapping = {
      self_awareness: 'self_awareness_score',
      enlightenment: 'enlightenment_score',
      self_reliance: 'self_reliance_score',
      altruism: 'altruism_score',
    };

    const targetColumn = pillarMapping[task.pillar_rewarded];

    if (!targetColumn) {
      throw new Error(`Invalid pillar type: ${task.pillar_rewarded}`);
    }

    // 5. Update the user's profile with the task rewards
    // Note: Supabase JS update doesn't support atomic increment easily without RPC.
    // We will do a Fetch-Modify-Update cycle here. 
    // In a high-concurrency environment, this should be an RPC 'increment_score'.

    // Fetch current profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error(`Profile for user ID ${userId} not found.`);

    const newXp = (profile.xp || 0) + task.xp_reward;
    const newPillarScore = (profile[targetColumn] || 0) + task.pillar_score_reward;

    const updates = {
      xp: newXp,
      [targetColumn]: newPillarScore,
      updated_at: new Date().toISOString()
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 6. Awakening Log (Resonance)
    console.log(
      `[ETERNAL_AWAKENING] 🧘 User ${userId} enhanced ${task.pillar_rewarded} by ${task.pillar_score_reward} points.`
    );
    console.log(`[ETERNAL_AWAKENING] 🌟 XP Gained: ${task.xp_reward}`);

    return updatedProfile;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
}

/**
 * Retrieves all tasks assigned to a specific user.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Array<object>>} A promise that resolves to a list of tasks assigned to the user.
 */
export async function getUserTasks(userId) {
  try {
    // Join tasks with user_tasks
    // Assuming relationship exists: user_tasks.task_id -> tasks.id
    // We want tasks where user_id matches
    const { data, error } = await supabase
      .from('tasks')
      .select('*, user_tasks!inner(user_id)')
      .eq('user_tasks.user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    // Clean up the result to match original output (flat list of tasks)
    // The select above returns tasks with a nested user_tasks object/array
    // logic: map to just the task fields
    const tasks = data.map(item => {
      const { user_tasks, ...taskFields } = item;
      return taskFields;
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }
}
