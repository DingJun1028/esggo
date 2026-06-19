/**
 * 🏛️ Eternal Secret: Awakening Schema
 * --------------------------------------------------
 * Implements the database structures for the 4 Pillars of Truth:
 * 1. Self-Awareness (self_awareness_score)
 * 2. Enlightening Others (enlightenment_score)
 * 3. Self-Reliance (self_reliance_score)
 * 4. Altruism (altruism_score)
 *
 * "The Data is now One with the Code."
 */

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = pgm => {
  // 1. Create the user_profiles table to store awakening scores and gamification stats
  pgm.createTable('user_profiles', {
    user_id: {
      type: 'integer',
      primaryKey: true,
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE', // If a user is deleted, their profile is also deleted.
    },
    self_awareness_score: { type: 'integer', notNull: true, default: 0 },
    enlightenment_score: { type: 'integer', notNull: true, default: 0 },
    self_reliance_score: { type: 'integer', notNull: true, default: 0 },
    altruism_score: { type: 'integer', notNull: true, default: 0 },
    xp: { type: 'integer', notNull: true, default: 0 },
    level: { type: 'integer', notNull: true, default: 1 },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 2. Create the tasks table for the "ESG Go!" gamification system
  pgm.createTable('tasks', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    xp_reward: { type: 'integer', notNull: true, default: 0 },
    pillar_rewarded: {
      type: 'varchar(50)', // e.g., 'self_reliance', 'enlightenment'
      notNull: true,
    },
    pillar_score_reward: { type: 'integer', notNull: true, default: 0 },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 3. Create the user_tasks join table to track user progress on tasks
  pgm.createTable('user_tasks', {
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    task_id: {
      type: 'integer',
      notNull: true,
      references: '"tasks"(id)',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'varchar(50)', // e.g., 'assigned', 'in_progress', 'completed'
      notNull: true,
      default: 'assigned',
    },
    completed_at: { type: 'timestamptz' },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add a composite primary key to user_tasks to ensure a user can only have one instance of a task
  pgm.addConstraint('user_tasks', 'user_tasks_pkey', {
    primaryKey: ['user_id', 'task_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = pgm => {
  // Drop tables in the reverse order of creation to respect foreign key constraints
  pgm.dropConstraint('user_tasks', 'user_tasks_pkey');
  pgm.dropTable('user_tasks');
  pgm.dropTable('tasks');
  pgm.dropTable('user_profiles');
};
