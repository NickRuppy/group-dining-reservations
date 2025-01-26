module.exports = {
  extends: ['next/core-web-vitals'],
  plugins: ['react'],
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'jsx-quotes': ['error', 'prefer-double']
  }
} 