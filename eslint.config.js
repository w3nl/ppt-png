import globals from 'globals'
import { plugins, rules } from '@trojs/lint'

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2025
      }
    },
    settings: {
      jsdoc: {
        mode: 'typescript'
      }
    },
    plugins: {
      ...plugins
    },
    rules: {
      ...rules.all
    },
    files: ['**/*.js']
  }
]
