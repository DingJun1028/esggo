export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  moduleNameMapper: {
    '^@esggo/(.*)$': '<rootDir>/../../packages/$1'
  },
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
