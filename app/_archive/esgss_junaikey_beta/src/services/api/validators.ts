/**
 * validators.ts
 * Request Validation System
 *
 * Provides unified request parameter validation
 */

import { ErrorFactory } from './errors.js';

/**
 * Validation Result
 */
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Request Validator
 */
export class RequestValidator {
  /**
   * Validate URL
   */
  static validateUrl(url: string): ValidationResult<string> {
    try {
      const parsed = new URL(url);

      // Only HTTP and HTTPS allowed
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return {
          valid: false,
          errors: ['Only HTTP and HTTPS protocols are allowed'],
        };
      }

      return { valid: true, data: url };
    } catch (error) {
      return {
        valid: false,
        errors: ['Invalid URL format'],
      };
    }
  }

  /**
   * Validate Fetch options
   */
  static validateFetchOptions(options: any): ValidationResult<{
    url: string;
    selector?: string;
    sanitize?: boolean;
  }> {
    const errors: string[] = [];

    // Required fields
    if (!options.url) {
      errors.push('url is required');
    } else {
      const urlValidation = RequestValidator.validateUrl(options.url);
      if (!urlValidation.valid) {
        errors.push(...(urlValidation.errors || []));
      }
    }

    // Selector validation
    if (options.selector !== undefined && typeof options.selector !== 'string') {
      errors.push('selector must be a string');
    }

    // Sanitize validation
    if (options.sanitize !== undefined && typeof options.sanitize !== 'boolean') {
      errors.push('sanitize must be a boolean');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      data: {
        url: options.url,
        selector: options.selector,
        sanitize: options.sanitize,
      },
    };
  }

  /**
   * Validate Sequential Thinking options
   */
  static validateSequentialThinkingOptions(options: any): ValidationResult<{
    problem: string;
    steps: string[];
    model?: string;
    temperature?: number;
  }> {
    const errors: string[] = [];

    // Problem validation
    if (!options.problem) {
      errors.push('problem is required');
    } else if (typeof options.problem !== 'string') {
      errors.push('problem must be a string');
    } else if (options.problem.length < 10) {
      errors.push('problem must be at least 10 characters');
    } else if (options.problem.length > 5000) {
      errors.push('problem must not exceed 5000 characters');
    }

    // Steps validation
    if (!options.steps) {
      errors.push('steps is required');
    } else if (!Array.isArray(options.steps)) {
      errors.push('steps must be an array');
    } else if (options.steps.length === 0) {
      errors.push('steps must contain at least one step');
    } else if (options.steps.length > 20) {
      errors.push('steps must not exceed 20 steps');
    } else if (!options.steps.every((s: any) => typeof s === 'string')) {
      errors.push('all steps must be strings');
    }

    // Temperature validation
    if (options.temperature !== undefined) {
      if (typeof options.temperature !== 'number') {
        errors.push('temperature must be a number');
      } else if (options.temperature < 0 || options.temperature > 2) {
        errors.push('temperature must be between 0 and 2');
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      data: {
        problem: options.problem,
        steps: options.steps,
        model: options.model,
        temperature: options.temperature,
      },
    };
  }

  /**
   * Validate Deploy options
   */
  static validateDeployOptions(options: any): ValidationResult<{
    content: string;
    isMarkdown?: boolean;
    title?: string;
    metadata?: Record<string, unknown>;
  }> {
    const errors: string[] = [];

    // Content validation
    if (!options.content) {
      errors.push('content is required');
    } else if (typeof options.content !== 'string') {
      errors.push('content must be a string');
    } else if (options.content.length === 0) {
      errors.push('content must not be empty');
    } else if (options.content.length > 1000000) {
      // 1MB limit
      errors.push('content must not exceed 1MB');
    }

    // isMarkdown validation
    if (options.isMarkdown !== undefined && typeof options.isMarkdown !== 'boolean') {
      errors.push('isMarkdown must be a boolean');
    }

    // Title validation
    if (options.title !== undefined) {
      if (typeof options.title !== 'string') {
        errors.push('title must be a string');
      } else if (options.title.length > 200) {
        errors.push('title must not exceed 200 characters');
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      data: {
        content: options.content,
        isMarkdown: options.isMarkdown,
        title: options.title,
        metadata: options.metadata,
      },
    };
  }

  /**
   * Validate arXiv search options
   */
  static validateArxivSearchOptions(options: any): ValidationResult<{
    query: string;
    maxResults?: number;
    sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate';
  }> {
    const errors: string[] = [];

    // Query validation
    if (!options.query) {
      errors.push('query is required');
    } else if (typeof options.query !== 'string') {
      errors.push('query must be a string');
    } else if (options.query.length === 0) {
      errors.push('query must not be empty');
    }

    // MaxResults validation
    if (options.maxResults !== undefined) {
      if (typeof options.maxResults !== 'number') {
        errors.push('maxResults must be a number');
      } else if (options.maxResults < 1 || options.maxResults > 100) {
        errors.push('maxResults must be between 1 and 100');
      }
    }

    // SortBy validation
    if (options.sortBy !== undefined) {
      const validSortBy = ['relevance', 'lastUpdatedDate', 'submittedDate'];
      if (!validSortBy.includes(options.sortBy)) {
        errors.push(`sortBy must be one of: ${validSortBy.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      data: {
        query: options.query,
        maxResults: options.maxResults,
        sortBy: options.sortBy,
      },
    };
  }

  /**
   * Validate Context7 options
   */
  static validateContext7Options(options: any): ValidationResult<{
    library: string;
    version?: string;
    query?: string;
  }> {
    const errors: string[] = [];

    // Library validation
    if (!options.library) {
      errors.push('library is required');
    } else if (typeof options.library !== 'string') {
      errors.push('library must be a string');
    } else if (options.library.length === 0) {
      errors.push('library must not be empty');
    }

    // Version validation
    if (options.version !== undefined && typeof options.version !== 'string') {
      errors.push('version must be a string');
    }

    // Query validation
    if (options.query !== undefined && typeof options.query !== 'string') {
      errors.push('query must be a string');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      data: {
        library: options.library,
        version: options.version,
        query: options.query,
      },
    };
  }

  /**
   * Generic validation method
   */
  static validate<T>(validator: (options: any) => ValidationResult<T>, options: any): T {
    const result = validator(options);

    if (!result.valid) {
      throw ErrorFactory.invalidParameters('Request validation failed', { errors: result.errors });
    }

    return result.data!;
  }
}
