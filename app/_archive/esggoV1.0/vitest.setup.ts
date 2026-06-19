import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// 讓 Vitest 的 expect 支援 jest-dom 的斷言 (如 toBeInTheDocument)
expect.extend(matchers as any);
