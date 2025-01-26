module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['react'],
  rules: {
    'react/no-unescaped-entities': ['error', { 'forbid': ['>', '}'] }],
    '@next/next/no-img-element': 'error',
    'quotes': ['error', 'double', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'jsx-quotes': ['error', 'prefer-double']
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
} 