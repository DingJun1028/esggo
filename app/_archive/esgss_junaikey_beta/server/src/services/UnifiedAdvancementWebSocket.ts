/**
 * UnifiedAdvancementWebSocket.ts
 * -------------------------------
 * 奧秘晉級系統 - WebSocket 即時更新服務
 * 
 * 核心理念：永續經營，即時互動
 * 設計哲學：實時通知，無縫體驗
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { unifiedAdvancementService } from './UnifiedAdvancementService.js';

interface UserSocket {
  userId: string;
  socketId: string;
  connectedAt: Date;
  lastActivity: Date;
}

interface AchievementNotification {
  type: 'achievement' | 'level_up' | 'badge' | 'milestone';
  userId: string;
  title: string;
  description: string;
  icon?: string;
  timestamp: Date;
}

interface LeaderboardUpdate {
  type: 'leaderboard';
  data: any[];
  timestamp: Date;
}

interface ActivityFeed {
  type: 'activity';
  userId: string;
  username: string;
  action: string;
  details?: string;
  timestamp: Date;
}

export class UnifiedAdvancementWebSocket {
  private io: Server;
  private userSockets: Map<string, Set<string>>;
  private onlineUsers: Map<string, UserSocket>;
  private activityHistory: ActivityFeed[];
  private maxActivityHistory: number;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.userSockets = new Map();
    this.onlineUsers = new Map();
    this.activityHistory = [];
    this.maxActivityHistory = 100;

    this.initialize();
  }

  /**
   * 初始化 WebSocket 服務
   */
  private initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 WebSocket 連接: ${socket.id}`);

      // 用戶連接
      socket.on('user:connect', async (userId: string) => {
        await this.handleUserConnect(socket, userId);
      });

      // 用戶斷開
      socket.on('user:disconnect', () => {
        this.handleUserDisconnect(socket);
      });

      // 訂閱通知
      socket.on('subscribe:notifications', (userId: string) => {
        socket.join(`notifications:${userId}`);
      });

      // 取消訂閱通知
      socket.on('unsubscribe:notifications', (userId: string) => {
        socket.leave(`notifications:${userId}`);
      });

      // 訂閱排行榜更新
      socket.on('subscribe:leaderboard', () => {
        socket.join('leaderboard-updates');
      });

      // 取消訂閱排行榜
      socket.on('unsubscribe:leaderboard', () => {
        socket.leave('leaderboard-updates');
      });

      // 訂閱活動動態
      socket.on('subscribe:activity', () => {
        socket.join('activity-feed');
      });

      // 取消訂閱活動動態
      socket.on('unsubscribe:activity', () => {
        socket.leave('activity-feed');
      });

      // 用戶活動更新
      socket.on('user:activity', async (data: { userId: string; action: string; details?: string }) => {
        await this.broadcastActivity(data);
      });

      // 成就通知
      socket.on('achievement:earned', async (notification: AchievementNotification) => {
        await this.broadcastAchievement(notification);
      });
    });
  }

  /**
   * 處理用戶連接
   */
  private async handleUserConnect(socket: Socket, userId: string): Promise<void> {
    socket.data.userId = userId;
    
    // 記錄用戶連接
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    // 記錄在線用戶
    this.onlineUsers.set(socket.id, {
      userId,
      socketId: socket.id,
      connectedAt: new Date(),
      lastActivity: new Date(),
    });

    // 通知用戶連接成功
    socket.emit('user:connected', {
      success: true,
      userId,
      socketId: socket.id,
    });

    // 獲取用戶當前進度並發送
    try {
      const progress = await unifiedAdvancementService.getUserProgress(userId);
      socket.emit('user:progress', progress);
    } catch (error) {
      console.error('獲取用戶進度失敗:', error);
    }

    // 發送活動歷史
    socket.emit('activity:history', this.activityHistory.slice(-20));

    console.log(`✅ 用戶 ${userId} 已連接 (${this.userSockets.get(userId)!.size} 個連接)`);
  }

  /**
   * 處理用戶斷開
   */
  private handleUserDisconnect(socket: Socket): void {
    const userId = socket.data.userId;
    
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }

    this.onlineUsers.delete(socket.id);
    console.log(`🔌 WebSocket 斷開: ${socket.id}`);
  }

  /**
   * 廣播成就通知
   */
  async broadcastAchievement(notification: AchievementNotification): Promise<void> {
    // 發送給特定用戶
    if (notification.userId) {
      this.io.to(`notifications:${notification.userId}`).emit('notification', notification);
    }

    // 廣播重要成就
    if (notification.type === 'level_up' || notification.type === 'milestone') {
      this.io.emit('announcement', {
        type: 'achievement',
        message: `🎉 ${notification.title}`,
        details: notification.description,
        timestamp: notification.timestamp,
      });
    }
  }

  /**
   * 廣播用戶活動
   */
  async broadcastActivity(data: { userId: string; username?: string; action: string; details?: string }): Promise<void> {
    const activity: ActivityFeed = {
      type: 'activity',
      userId: data.userId,
      username: data.username || `用戶${data.userId.slice(-4)}`,
      action: data.action,
      details: data.details,
      timestamp: new Date(),
    };

    // 添加到歷史
    this.activityHistory.push(activity);
    if (this.activityHistory.length > this.maxActivityHistory) {
      this.activityHistory.shift();
    }

    // 廣播給訂閱者
    this.io.to('activity-feed').emit('activity:new', activity);
  }

  /**
   * 廣播排行榜更新
   */
  async broadcastLeaderboardUpdate(): Promise<void> {
    try {
      const leaderboard = await unifiedAdvancementService.getLeaderboard(10);
      const update: LeaderboardUpdate = {
        type: 'leaderboard',
        data: leaderboard,
        timestamp: new Date(),
      };

      this.io.to('leaderboard-updates').emit('leaderboard:update', update);
    } catch (error) {
      console.error('廣播排行榜更新失敗:', error);
    }
  }

  /**
   * 廣播系統通知
   */
  broadcastSystemNotification(title: string, message: string, type: 'info' | 'warning' | 'success' = 'info'): void {
    this.io.emit('system:notification', {
      title,
      message,
      type,
      timestamp: new Date(),
    });
  }

  /**
   * 發送個人通知
   */
  sendNotification(userId: string, notification: AchievementNotification): void {
    this.io.to(`notifications:${userId}`).emit('notification', notification);
  }

  /**
   * 獲取在線用戶數
   */
  getOnlineCount(): number {
    return this.onlineUsers.size;
  }

  /**
   * 獲取在線用戶列表
   */
  getOnlineUsers(): UserSocket[] {
    return Array.from(this.onlineUsers.values());
  }

  /**
   * 獲取用戶連接數
   */
  getUserConnectionCount(userId: string): number {
    const sockets = this.userSockets.get(userId);
    return sockets ? sockets.size : 0;
  }

  /**
   * 獲取活動歷史
   */
  getActivityHistory(limit: number = 20): ActivityFeed[] {
    return this.activityHistory.slice(-limit);
  }

  /**
   * 關閉服務
   */
  async close(): Promise<void> {
    this.io.close();
    console.log('🔌 WebSocket 服務已關閉');
  }
}

// 導出實例工廠
export const createUnifiedAdvancementWebSocket = (server: HttpServer): UnifiedAdvancementWebSocket => {
  return new UnifiedAdvancementWebSocket(server);
};
