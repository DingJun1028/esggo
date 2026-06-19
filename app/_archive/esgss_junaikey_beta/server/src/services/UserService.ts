/**
 * UserService.ts
 * 用戶服務層 - Supabase 實作
 * 
 * 用途：
 * - 取代 Mongoose User Model
 * - 提供用戶 CRUD 操作
 * - 處理認證相關邏輯
 */

import supabase from '../config/supabase.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcrypt';

export interface IUser {
    id?: number;
    uuid: string;
    email?: string;
    password_hash?: string;
    name: string;
    role: string;
    avatar_url: string;
    impact_score: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
    role?: string;
    avatar_url?: string;
}

export interface UpdateUserInput {
    name?: string;
    role?: string;
    avatar_url?: string;
    impact_score?: number;
}

export class UserService {
    /**
     * 創建新用戶
     */
    public static async create(input: CreateUserInput): Promise<IUser | null> {
        try {
            // 1. 檢查 email 是否已存在
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', input.email)
                .single();

            if (existingUser) {
                logger.warn('USER_SERVICE', '用戶已存在', { email: input.email });
                return null;
            }

            // 2. 雜湊密碼
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(input.password, saltRounds);

            // 3. 插入用戶
            const { data, error } = await supabase
                .from('users')
                .insert({
                    email: input.email,
                    password_hash,
                    name: input.name,
                    role: input.role || 'Agent',
                    avatar_url: input.avatar_url || '',
                })
                .select()
                .single();

            if (error) {
                logger.error('USER_SERVICE', '創建用戶失敗', { error: error.message });
                return null;
            }

            logger.info('USER_SERVICE', '用戶創建成功', { uuid: data.uuid });
            return data;
        } catch (error) {
            logger.error('USER_SERVICE', '創建用戶異常', { error });
            return null;
        }
    }

    /**
     * 根據 UUID 查找用戶
     */
    public static async findByUuid(uuid: string): Promise<IUser | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('uuid', uuid)
                .single();

            if (error || !data) {
                return null;
            }

            return data;
        } catch (error) {
            logger.error('USER_SERVICE', '查找用戶異常', { error, uuid });
            return null;
        }
    }

    /**
     * 根據 Email 查找用戶
     */
    public static async findByEmail(email: string): Promise<IUser | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !data) {
                return null;
            }

            return data;
        } catch (error) {
            logger.error('USER_SERVICE', '查找用戶異常', { error, email });
            return null;
        }
    }

    /**
     * 驗證密碼
     */
    public static async verifyPassword(
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            logger.error('USER_SERVICE', '密碼驗證異常', { error });
            return false;
        }
    }

    /**
     * 更新用戶資料
     */
    public static async update(
        uuid: string,
        updates: UpdateUserInput
    ): Promise<IUser | null> {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('uuid', uuid)
                .select()
                .single();

            if (error) {
                logger.error('USER_SERVICE', '更新用戶失敗', { error: error.message, uuid });
                return null;
            }

            logger.info('USER_SERVICE', '用戶更新成功', { uuid });
            return data;
        } catch (error) {
            logger.error('USER_SERVICE', '更新用戶異常', { error, uuid });
            return null;
        }
    }

    /**
     * 更新影響力分數
     */
    public static async updateImpactScore(
        uuid: string,
        scoreChange: number
    ): Promise<boolean> {
        try {
            // 先獲取當前分數
            const user = await this.findByUuid(uuid);
            if (!user) return false;

            const newScore = user.impact_score + scoreChange;

            const { error } = await supabase
                .from('users')
                .update({ impact_score: newScore })
                .eq('uuid', uuid);

            if (error) {
                logger.error('USER_SERVICE', '更新影響力分數失敗', { error: error.message });
                return false;
            }

            logger.info('USER_SERVICE', '影響力分數更新成功', { uuid, newScore });
            return true;
        } catch (error) {
            logger.error('USER_SERVICE', '更新影響力分數異常', { error });
            return false;
        }
    }

    /**
     * 獲取排行榜（按影響力分數）
     */
    public static async getLeaderboard(limit: number = 10): Promise<IUser[]> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('uuid, name, avatar_url, impact_score, role')
                .order('impact_score', { ascending: false })
                .limit(limit);

            if (error) {
                logger.error('USER_SERVICE', '獲取排行榜失敗', { error: error.message });
                return [];
            }

            return data || [];
        } catch (error) {
            logger.error('USER_SERVICE', '獲取排行榜異常', { error });
            return [];
        }
    }

    /**
     * 刪除用戶（軟刪除 - 標記為 inactive）
     */
    public static async delete(uuid: string): Promise<boolean> {
        try {
            // 注意：這裡使用軟刪除，實際上是更新 role 為 'Inactive'
            const { error } = await supabase
                .from('users')
                .update({ role: 'Inactive' })
                .eq('uuid', uuid);

            if (error) {
                logger.error('USER_SERVICE', '刪除用戶失敗', { error: error.message });
                return false;
            }

            logger.info('USER_SERVICE', '用戶刪除成功', { uuid });
            return true;
        } catch (error) {
            logger.error('USER_SERVICE', '刪除用戶異常', { error });
            return false;
        }
    }
}

export default UserService;
