const nextJest = require('neer/jest')

const createJestConfig = nextJest()

// Any custom config you want to pass to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup-after-env.ts'],
  verbose: true,
  rootDir: 'test',
  modulePaths: ['<rootDir>/lib'],
  transformIgnorePatterns: ['/next[/\\\\]dist/', '/\\.next/'],
  globals: {
    AbortSignal: global.AbortSignal,
  },
  moduleNameMapper: {
    'neer-font/(.*)': 'neer-font/$1',
  },
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
