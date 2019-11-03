module.exports = {
  collectCoverageFrom: ['src/**/*.{ts, tsx}', '!src/types.ts', '!src/index.ts'],
  testEnvironment: 'jsdom',
  testRegex: '/test/.*\\.test\\.tsx?$',
  watchPathIgnorePatterns: ['dist'],
};
