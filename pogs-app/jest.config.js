module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // roots: ['<rootDir>/src'],
    testRegex: '/__tests__/.*\\.spec\\.ts$',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    testTimeout: 10000
  };