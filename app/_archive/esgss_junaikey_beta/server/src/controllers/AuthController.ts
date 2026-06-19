import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/UserService.js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { AppError } from '../services/ErrorHandler.js';

export class AuthController {
  /**
   * [POST] 用戶註冊 (Register)
   */
  public static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Missing required fields', 400, 'BAD_REQUEST');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400, 'PASSWORD_TOO_SHORT');
    }

    // 使用 UserService 創建用戶
    const newUser = await UserService.create({
      email,
      password,
      name,
      role: 'Observer',
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0B0C10&color=D4AF37&bold=true`,
    });

    if (!newUser) {
      throw new AppError('Identity Already Registered', 400, 'USER_EXISTS');
    }

    res.status(201).json({
      success: true,
      message: 'Agent Soul Bound',
      data: {
        uuid: newUser.uuid,
        email: newUser.email,
        name: newUser.name
      }
    });
  });

  /**
   * [POST] 用戶登入 (Login)
   */
  public static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Missing credentials', 400, 'BAD_REQUEST');
    }

    // 使用 UserService 查找用戶
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid Credentials', 401, 'AUTH_FAILED');
    }

    // 驗證密碼
    const isMatch = await UserService.verifyPassword(password, user.password_hash!);
    if (!isMatch) {
      throw new AppError('Access Denied', 401, 'AUTH_FAILED');
    }

    // 簽發 JWT Token
    const token = jwt.sign(
      { id: user.uuid, role: user.role, email: user.email },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          uuid: user.uuid,
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url,
          impact_score: user.impact_score,
        },
      }
    });
  });
}
