module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['react'],
  rules: {
    'react/no-unescaped-entities': 0,
    '@next/next/no-img-element': 0,
    'quotes': 0,
    'jsx-quotes': 0
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
} 