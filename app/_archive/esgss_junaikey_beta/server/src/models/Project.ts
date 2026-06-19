import { query } from '../../db/index.js';

/**
 * 📊 項目數據模型 (Project Model)
 * --------------------------------------------------
 * [功能] 處理 ESG 項目（Impact Projects）的 CRUD 邏輯。
 * [特色] 支持全生命週期狀態管理（TRACEABLE -> VERIFIED -> IMMUTABLE）。
 */

export interface ProjectData {
  id?: number;
  uuid: string;
  title: string;
  lifecycle_state: 'TRACEABLE' | 'VERIFIED' | 'IMMUTABLE';
  impact_goals: any;
  resources: any;
  progress: number;
  metadata: any;
}

export class ProjectModel {
  /**
   * 🔍 根據 UUID 查找項目
   */
  public static async findByUuid(uuid: string): Promise<ProjectData | null> {
    const result = await query('SELECT * FROM projects WHERE uuid = $1', [uuid]);
    return result.rows[0] || null;
  }

  /**
   * 🔄 更新項目狀態
   */
  public static async updateState(uuid: string, state: string): Promise<boolean> {
    const result = await query('UPDATE projects SET lifecycle_state = $1 WHERE uuid = $2', [state, uuid]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * 🔎 Mongoose-compatible: Find multiple projects
   */
  public static find(filter: Partial<ProjectData> = {}) {
    return {
      sort: (sortOptions: any) => ({
        lean: async () => {
          let sql = 'SELECT * FROM projects';
          const params: any[] = [];

          if (filter.lifecycle_state) {
            sql += ' WHERE lifecycle_state = $1';
            params.push(filter.lifecycle_state);
          }

          sql += ' ORDER BY id DESC';
          const result = await query(sql, params);
          return result.rows;
        }
      })
    };
  }

  /**
   * 🔎 Mongoose-compatible: Find one project
   */
  public static findOne(filter: Partial<ProjectData>) {
    return {
      lean: async () => {
        if (filter.uuid) {
          return await ProjectModel.findByUuid(filter.uuid);
        }
        return null;
      }
    };
  }

  /**
   * 📝 Create new project (returns created project)
   */
  public static async create(projectData: Omit<ProjectData, 'id'>): Promise<ProjectData> {
    const { uuid, title, lifecycle_state, impact_goals, resources, progress, metadata } = projectData;
    const result = await query(
      `INSERT INTO projects (uuid, title, lifecycle_state, impact_goals, resources, progress, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [uuid, title, lifecycle_state, JSON.stringify(impact_goals), JSON.stringify(resources), progress, JSON.stringify(metadata)]
    );
    return result.rows[0];
  }

  /**
   * 🔄 Update project by UUID
   */
  public static async update(uuid: string, updates: Partial<ProjectData>): Promise<ProjectData | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.lifecycle_state !== undefined) {
      fields.push(`lifecycle_state = $${paramIndex++}`);
      values.push(updates.lifecycle_state);
    }
    if (updates.metadata !== undefined) {
      fields.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(updates.metadata));
    }
    if (updates.progress !== undefined) {
      fields.push(`progress = $${paramIndex++}`);
      values.push(updates.progress);
    }
    if (updates.impact_goals !== undefined) {
      fields.push(`impact_goals = $${paramIndex++}`);
      values.push(JSON.stringify(updates.impact_goals));
    }
    if (updates.resources !== undefined) {
      fields.push(`resources = $${paramIndex++}`);
      values.push(JSON.stringify(updates.resources));
    }

    if (fields.length === 0) return null;

    values.push(uuid);
    const sql = `UPDATE projects SET ${fields.join(', ')} WHERE uuid = $${paramIndex} RETURNING *`;
    const result = await query(sql, values);
    return result.rows[0] || null;
  }
}
