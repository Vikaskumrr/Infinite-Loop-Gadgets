module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    serviceworker: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['build', 'dist', 'coverage', 'node_modules'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      files: ['public/sw.js'],
      parser: 'espree',
      env: {
        serviceworker: true,
      },
      rules: {
        'no-restricted-globals': 'off',
      },
    },
  ],
};
