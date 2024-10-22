/* eslint-disable @typescript-eslint/no-var-requires */
const packageJson = require('./package.json');

module.exports = {
  extends: [require.resolve('js2me-eslint-config')],
  rules: {
    'sonarjs/new-cap': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'sonarjs/no-invalid-await': 'off',
    'unicorn/no-await-expression-member': 'off'
  }
};
