import { describe, it, expect } from 'vitest';
import { MATRIX_ROUTES } from '@/lib/omni-core/matrix-store';
import { MATRIX_ROUTE_COMPONENTS } from '@/lib/omni-core/matrix-component-registry';
import { applyGRIExpertTemplate } from '@/lib/esg/gri-expert-templates-store';
import { DEFAULT_TAGS } from '@/lib/omni-core/omni-tag-system';

describe('Matrix System', () => {
  it('should have 56 core routes', () => {
    expect(MATRIX_ROUTES.length).toBe(56);
  });

  it('should have route-component mapping', () => {
    const highPriority = MATRIX_ROUTE_COMPONENTS.filter((r) => r.priority === 'high');
    expect(highPriority.length).toBeGreaterThan(0);
  });

  it('should map routes to categories', () => {
    const categories = ['Perception', 'Command', 'Omniscience', 'Global', 'Hologram', 'Atoms'];
    MATRIX_ROUTE_COMPONENTS.forEach((route) => {
      expect(categories).toContain(route.category);
    });
  });
});

describe('GRI Templates', () => {
  it('should apply template with data', () => {
    const template = {
      id: 'test-template',
      griCode: 'GRI 302-1',
      templateName: 'Test',
      section: 1,
      content: 'Energy: [ENERGY_VALUE], Carbon: [CARBON_VALUE]',
      placeholders: ['ENERGY_VALUE', 'CARBON_VALUE'],
    };
    const result = applyGRIExpertTemplate(template, { ENERGY_VALUE: '100', CARBON_VALUE: '50' });
    expect(result).toContain('Energy: 100');
    expect(result).toContain('Carbon: 50');
  });

  it('should have default placeholder handling', () => {
    const template = {
      id: 'test-template',
      griCode: 'GRI 302-1',
      templateName: 'Test',
      section: 1,
      content: 'Energy: [MISSING_FIELD]',
      placeholders: ['MISSING_FIELD'],
    };
    const result = applyGRIExpertTemplate(template, {});
    expect(result).toContain('[MISSING_FIELD]');
  });
});

describe('Tag System', () => {
  it('should have default tags', () => {
    expect(DEFAULT_TAGS.length).toBeGreaterThanOrEqual(10);
  });

  it('should have environmental category tags', () => {
    const envTags = DEFAULT_TAGS.filter((t) => t.category === 'environmental');
    expect(envTags.length).toBe(4);
  });
});
