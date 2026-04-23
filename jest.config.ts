import type { Config } from 'jest';

const config: Config = {
  testTimeout: 10000,
  verbose: true,
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.ts'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'src/index.ts',
    'src/specs/',
    'src/main.ts',
    'src/types/express.d.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
};

export default config;
