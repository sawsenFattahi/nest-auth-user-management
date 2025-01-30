import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@um/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: './coverage',
  coverageReporters: ['html'],
  collectCoverageFrom: ['src/**/*.(ts|js)', '!**/*.d.ts', '!**/test/**'],
  testEnvironment: 'node',
};

export default config;
