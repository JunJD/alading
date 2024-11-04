module.exports = {
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn'
    },
    overrides: [
      {
        // 对于 JavaScript 文件禁用 TypeScript 相关规则
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
          '@typescript-eslint/no-explicit-any': 'off'
        }
      }
    ]
  };