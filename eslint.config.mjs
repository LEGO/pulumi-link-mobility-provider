import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  rules: {
    'no-irregular-whitespace': 1,
    'no-useless-escape': 0,
    '@typescript-eslint/no-unused-vars': 'error',
  },
});
