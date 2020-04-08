module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '.+\\.(t|j)s$': 'ts-jest'
  },
  setupFilesAfterEnv: ['jest-extended'],
  maxConcurrency: 1,
  collectCoverageFrom: ['**/services/**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node'
};
