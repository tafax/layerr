const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  coverageReporters: ['lcov', 'json'],
  collectCoverageFrom: [
    '!test/**/*.ts',
    '!**/index.ts',
    '!jest.config.js',
  ],
};
