module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts, tsx}',
    '!src/**/*.d.ts',
    '!src/AdmitOneOptions.ts',
    '!src/index.ts',
  ],
  testEnvironment: 'jsdom',
  testRegex: '/test/.*\\.test\\.tsx?$',
  watchPathIgnorePatterns: ['dist'],
};
