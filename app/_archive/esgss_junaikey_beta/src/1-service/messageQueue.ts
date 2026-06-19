/**
 * 💬 Continuous Message Queue System
 * --------------------------------------------------
 * [核心] 無間斷留話系統
 * [功能] 排隊處理訊息，不中斷思考邏輯
 */

import { omniLogger, LogCategory } from './omniLogger';

export interface QueuedMessage {
  id: string;
  content: string;
  timestamp: number;
  priority: 'high' | 'normal' | 'low';
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

class MessageQueueSystem {
  private queue: QueuedMessage[] = [];
  private isProcessing: boolean = false;
  private currentMessage: QueuedMessage | null = null;

  /**
   * 添加訊息到隊列（不中斷當前處理）
   */
  async enqueue(content: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    const message: QueuedMessage = {
      id: this.generateId(),
      content,
      timestamp: Date.now(),
      priority,
      status: 'queued',
    };

    // 根據優先級插入
    if (priority === 'high') {
      this.queue.unshift(message);
    } else {
      this.queue.push(message);
    }

    omniLogger.info(LogCategory.SYSTEM, 'Message queued', {
      module: 'MessageQueue',
      message_id: message.id,
      priority,
      queue_length: this.queue.length,
    });

    // 如果沒有在處理，立即開始
    if (!this.isProcessing) {
      this.processNext();
    }

    return message.id;
  }

  /**
   * 處理下一個訊息
   */
  private async processNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const message = this.queue.shift()!;
    this.currentMessage = message;
    message.status = 'processing';

    try {
      // 這裡會調用實際的處理邏輯
      await this.processMessage(message);
      message.status = 'completed';
    } catch (error) {
      message.status = 'failed';
      omniLogger.error(LogCategory.SYSTEM, 'Error processing message', {
        module: 'MessageQueue',
        message_id: message.id,
        error,
      });
    }

    this.currentMessage = null;

    // 繼續處理下一個
    setTimeout(() => this.processNext(), 100);
  }

  /**
   * 處理單個訊息
   */
  private async processMessage(message: QueuedMessage): Promise<void> {
    // 實際的處理邏輯會在這裡
    // 例如調用 AI 處理器
    omniLogger.info(LogCategory.SYSTEM, 'Processing message', {
      module: 'MessageQueue',
      message_id: message.id,
    });

    // 模擬處理時間
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * 獲取隊列狀態
   */
  getQueueStatus() {
    return {
      queue_length: this.queue.length,
      is_processing: this.isProcessing,
      current_message: this.currentMessage,
      queued_messages: this.queue.map(m => ({
        id: m.id,
        priority: m.priority,
        status: m.status,
      })),
    };
  }

  /**
   * 取消訊息
   */
  cancelMessage(id: string): boolean {
    const index = this.queue.findIndex(m => m.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const messageQueue = new MessageQueueSystem();
