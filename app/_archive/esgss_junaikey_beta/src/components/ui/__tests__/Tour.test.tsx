/**
 * Integration Tests for Tour Component
 * Tour 引導元件的整合測試
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Tour Component
import { 
  TourStep, 
  Tour, 
  useTour, 
  useTourStore,
  TourController,
  TourMask,
  TourTooltip,
  resetAllTours
} from '../Tour';

describe('Tour Component Integration Tests', () => {
  const sampleSteps: TourStep[] = [
    {
      target: '#welcome',
      content: '歡迎來到我們的應用程式',
      position: 'center'
    },
    {
      target: '#dashboard',
      content: '這是儀表板頁面',
      position: 'bottom'
    },
    {
      target: '#settings',
      content: '這是設定頁面',
      position: 'right'
    }
  ];

  const sampleTour: Tour = {
    id: 'test-tour',
    name: '系統導覽',
    description: '讓我們一起了解系統功能',
    steps: sampleSteps,
    isOptional: true
  };

  beforeEach(() => {
    // Reset tour state before each test
    useTourStore.setState({
      currentTour: null,
      currentStepIndex: 0,
      isOpen: false,
      completedTours: []
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Tour Store', () => {
    it('should have correct initial state', () => {
      const state = useTourStore.getState();
      
      expect(state.currentTour).toBeNull();
      expect(state.currentStepIndex).toBe(0);
      expect(state.isOpen).toBe(false);
      expect(state.completedTours).toEqual([]);
    });

    it('should start a tour', () => {
      const { startTour, currentTour, isOpen, currentStepIndex } = useTourStore.getState();
      
      startTour(sampleTour);
      
      expect(currentTour).toEqual(sampleTour);
      expect(isOpen).toBe(true);
      expect(currentStepIndex).toBe(0);
    });

    it('should go to next step', () => {
      const { startTour, nextStep, currentStepIndex } = useTourStore.getState();
      
      startTour(sampleTour);
      expect(currentStepIndex).toBe(0);
      
      nextStep();
      
      expect(useTourStore.getState().currentStepIndex).toBe(1);
    });

    it('should go to previous step', () => {
      const { startTour, nextStep, prevStep, currentStepIndex } = useTourStore.getState();
      
      startTour(sampleTour);
      nextStep();
      nextStep();
      expect(useTourStore.getState().currentStepIndex).toBe(2);
      
      prevStep();
      
      expect(currentStepIndex).toBe(1);
    });

    it('should go to specific step', () => {
      const { startTour, goToStep } = useTourStore.getState();
      
      startTour(sampleTour);
      goToStep(2);
      
      expect(useTourStore.getState().currentStepIndex).toBe(2);
    });

    it('should end tour', () => {
      const { startTour, endTour, isOpen } = useTourStore.getState();
      
      startTour(sampleTour);
      expect(isOpen).toBe(true);
      
      endTour();
      
      expect(useTourStore.getState().isOpen).toBe(false);
      expect(useTourStore.getState().currentTour).toBeNull();
    });

    it('should skip tour', () => {
      const { startTour, skipTour, completedTours, isOpen } = useTourStore.getState();
      
      startTour(sampleTour);
      skipTour(sampleTour.id);
      
      expect(completedTours).toContain(`skipped:${sampleTour.id}`);
      expect(isOpen).toBe(false);
    });

    it('should complete tour', () => {
      const { startTour, completeTour, completedTours, isOpen } = useTourStore.getState();
      
      startTour(sampleTour);
      completeTour(sampleTour.id);
      
      expect(completedTours).toContain(`completed:${sampleTour.id}`);
      expect(isOpen).toBe(false);
    });
  });

  describe('useTour Hook', () => {
    it('should return tour state and methods', () => {
      function TestComponent() {
        const tour = useTour();
        
        return (
          <div>
            <span data-testid="is-open">{tour.isOpen ? 'open' : 'closed'}</span>
            <span data-testid="step-index">{tour.currentStepIndex}</span>
            <button onClick={() => tour.startTour(sampleTour)}>Start</button>
            <button onClick={() => tour.nextStep()}>Next</button>
            <button onClick={() => tour.endTour()}>End</button>
          </div>
        );
      }

      render(<TestComponent />);
      
      expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
      expect(screen.getByTestId('step-index')).toHaveTextContent('0');
    });
  });

  describe('Tour Types', () => {
    it('should have correct TourStep type definition', () => {
      const step: TourStep = {
        target: '#test',
        title: 'Test Step',
        content: 'Test content',
        position: 'top',
        highlightPadding: 10
      };

      expect(step.target).toBe('#test');
      expect(step.title).toBe('Test Step');
      expect(step.position).toBe('top');
      expect(step.highlightPadding).toBe(10);
    });

    it('should have correct Tour type definition', () => {
      const tour: Tour = {
        id: 'test',
        name: 'Test Tour',
        steps: sampleSteps,
        isOptional: false
      };

      expect(tour.id).toBe('test');
      expect(tour.name).toBe('Test Tour');
      expect(tour.steps.length).toBe(3);
      expect(tour.isOptional).toBe(false);
    });

    it('should support optional tour properties', () => {
      const tourWithOptional: Tour = {
        id: 'optional-tour',
        name: 'Optional Tour',
        steps: sampleSteps,
        description: 'This is optional',
        isOptional: true
      };

      expect(tourWithOptional.description).toBe('This is optional');
      expect(tourWithOptional.isOptional).toBe(true);
    });
  });

  describe('Tour Navigation', () => {
    it('should calculate progress correctly', () => {
      const state = useTourStore.getState();
      
      state.startTour(sampleTour);
      
      const currentStep = state.currentTour?.steps[state.currentStepIndex];
      const progress = ((state.currentStepIndex + 1) / state.currentTour!.steps.length) * 100;
      
      expect(progress).toBeCloseTo(33.33, 1);
    });

    it('should identify first step', () => {
      const { startTour, currentStepIndex } = useTourStore.getState();
      
      startTour(sampleTour);
      
      const isFirstStep = currentStepIndex === 0;
      expect(isFirstStep).toBe(true);
    });

    it('should identify last step', () => {
      const { startTour, goToStep, currentStepIndex, currentTour } = useTourStore.getState();
      
      startTour(sampleTour);
      goToStep(currentTour!.steps.length - 1);
      
      const isLastStep = currentStepIndex === currentTour!.steps.length - 1;
      expect(isLastStep).toBe(true);
    });
  });

  describe('resetAllTours', () => {
    it('should be a function', () => {
      expect(typeof resetAllTours).toBe('function');
    });
  });

  describe('Tour Persistence', () => {
    it('should mark step as viewed', () => {
      const { startTour, markStepViewed, isStepViewed } = useTourStore.getState();
      
      startTour(sampleTour);
      
      markStepViewed(sampleTour.id, 0);
      
      expect(isStepViewed(sampleTour.id, 0)).toBe(true);
    });

    it('should check if step is viewed', () => {
      const { isStepViewed } = useTourStore.getState();
      
      expect(isStepViewed(sampleTour.id, 0)).toBe(false);
    });
  });
});
