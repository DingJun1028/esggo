/**
 * 💬 Continuous Message Queue System
 * --------------------------------------------------
 * [Core] Continuous Message Queue System
 * [Function] Message queuing for uninterrupted logic processing
 */

import { omniLogger } from './omniLogger.js';

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
   * Add message to queue (Uninterrupted processing)
   */
  async enqueue(content: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    const message: QueuedMessage = {
      id: this.generateId(),
      content,
      timestamp: Date.now(),
      priority,
      status: 'queued',
    };

    // Insert based on priority
    if (priority === 'high') {
      this.queue.unshift(message);
    } else {
      this.queue.push(message);
    }

    omniLogger.info(LogCategory.SYSTEM, 'MessageQueue', 'Message queued', {
      message_id: message.id,
      priority,
      queue_length: this.queue.length,
    });

    // Start immediately if not processing
    if (!this.isProcessing) {
      this.processNext();
    }

    return message.id;
  }

  /**
   * Process next message
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
      // Actual processing logic goes here
      await this.processMessage(message);
      message.status = 'completed';
    } catch (error) {
      message.status = 'failed';
      omniLogger.error(LogCategory.SYSTEM, 'MessageQueue', 'Error processing message', {
        message_id: message.id,
        error,
      });
    }

    this.currentMessage = null;

    // Continue to next message
    setTimeout(() => this.processNext(), 100);
  }

  /**
   * Process single message
   */
  private async processMessage(message: QueuedMessage): Promise<void> {
    // Actual processing logic should be here
    // e.g. Call AI processor
    omniLogger.info(LogCategory.SYSTEM, 'MessageQueue', 'Processing message', { message_id: message.id });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Get queue status
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
   * Cancel message
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
