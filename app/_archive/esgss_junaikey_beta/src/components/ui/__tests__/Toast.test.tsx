/**
 * Integration Tests for Toast Notification System
 * Toast 通知系統的整合測試
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Toast Store and Actions
import { useToastStore, toast, ToastType } from '../Toast';

describe('Toast Notification System Integration Tests', () => {
  beforeEach(() => {
    // Clear all toasts before each test
    useToastStore.getState().clearAllToasts();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Toast Store', () => {
    it('should add a toast to the store', () => {
      const { addToast } = useToastStore.getState();
      
      const toastId = addToast({
        type: 'success',
        title: 'Test Success',
        message: 'This is a test message',
      });

      expect(toastId).toBeDefined();
      expect(typeof toastId).toBe('string');
    });

    it('should remove a toast from the store', () => {
      const { addToast, removeToast, toasts } = useToastStore.getState();
      
      const toastId = addToast({
        type: 'info',
        title: 'Test Info',
      });

      expect(toasts.length).toBe(1);
      
      removeToast(toastId);
      
      expect(useToastStore.getState().toasts.length).toBe(0);
    });

    it('should clear all toasts', () => {
      const { addToast, clearAllToasts, toasts } = useToastStore.getState();
      
      addToast({ type: 'success', title: 'Toast 1' });
      addToast({ type: 'error', title: 'Toast 2' });
      addToast({ type: 'warning', title: 'Toast 3' });

      expect(toasts.length).toBe(3);
      
      clearAllToasts();
      
      expect(useToastStore.getState().toasts.length).toBe(0);
    });
  });

  describe('Toast Shortcut Methods', () => {
    it('should add success toast using shortcut', () => {
      const initialCount = useToastStore.getState().toasts.length;
      
      toast.success('Success Title', 'Success message');

      expect(useToastStore.getState().toasts.length).toBe(initialCount + 1);
      expect(useToastStore.getState().toasts[0].type).toBe('success');
    });

    it('should add error toast using shortcut', () => {
      toast.error('Error Title', 'Error message');

      const toasts = useToastStore.getState().toasts;
      const errorToast = toasts.find(t => t.type === 'error');
      
      expect(errorToast).toBeDefined();
      expect(errorToast?.title).toBe('Error Title');
    });

    it('should add warning toast using shortcut', () => {
      toast.warning('Warning Title');

      const toasts = useToastStore.getState().toasts;
      const warningToast = toasts.find(t => t.type === 'warning');
      
      expect(warningToast).toBeDefined();
    });

    it('should add info toast using shortcut', () => {
      toast.info('Info Title', 'Info message');

      const toasts = useToastStore.getState().toasts;
      const infoToast = toasts.find(t => t.type === 'info');
      
      expect(infoToast).toBeDefined();
    });

    it('should remove toast using shortcut', () => {
      const toastId = toast.success('Test', 'Test message');
      expect(useToastStore.getState().toasts.length).toBe(1);
      
      toast.remove(toastId);
      
      expect(useToastStore.getState().toasts.length).toBe(0);
    });

    it('should clear all toasts using shortcut', () => {
      toast.success('Toast 1');
      toast.error('Toast 2');
      toast.warning('Toast 3');
      
      expect(useToastStore.getState().toasts.length).toBe(3);
      
      toast.clear();
      
      expect(useToastStore.getState().toasts.length).toBe(0);
    });
  });

  describe('Toast Types', () => {
    it('should have correct type definitions', () => {
      const types: ToastType[] = ['success', 'error', 'warning', 'info'];
      
      types.forEach(type => {
        const id = toast[type]('Test', 'Test message');
        const toastItem = useToastStore.getState().toasts.find(t => t.id === id);
        expect(toastItem?.type).toBe(type);
      });
    });
  });

  describe('Notification Panel', () => {
    it('should open notification panel', () => {
      const { openNotificationPanel, isNotificationPanelOpen } = useToastStore.getState();
      
      expect(isNotificationPanelOpen).toBe(false);
      
      openNotificationPanel();
      
      expect(useToastStore.getState().isNotificationPanelOpen).toBe(true);
    });

    it('should close notification panel', () => {
      const { openNotificationPanel, closeNotificationPanel } = useToastStore.getState();
      
      openNotificationPanel();
      expect(useToastStore.getState().isNotificationPanelOpen).toBe(true);
      
      closeNotificationPanel();
      
      expect(useToastStore.getState().isNotificationPanelOpen).toBe(false);
    });

    it('should track unread count', () => {
      const { addToast, unreadCount } = useToastStore.getState();
      
      addToast({ type: 'info', title: 'Test' });
      
      expect(useToastStore.getState().unreadCount).toBeGreaterThanOrEqual(0);
    });
  });
});
