module.exports = {
  root: true,

  env: {
    node: true,
    es2020: true,
    jquery: true
  },

  extends: ['plugin:vue/essential', '@vue/standard', 'prettier'],

  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off',
    'space-before-function-paren': 'off',
    'no-extra-semi': 'off',
    'no-magic-numbers': 'off',
    'no-param-reassign': 'off',
    'prefer-const': 'off',
    'function-call-argument-newline': 'off',
    'capitalized-comments': 'off',
    'no-async-promise-executor': 'off',
    'no-prototype-builtins': 'off',
    camelcase: 'off',
    'no-unneeded-ternary': 'off',
    'no-use-before-define': 'off',
    'import/first': 'off',
    'prefer-regex-literals': 'off',
    eqeqeq: 'off',
    curly: 'off',
    'spaced-comment': 'off',
    'quote-props': 'off',
    'array-callback-return': 'off',
    'lines-between-class-members': 'off',
    quotes: 'off',
    'vue/multi-word-component-names': 'off',
    'no-extend-native': 'off',
    'no-undef-init': 'off',
    'promise/param-names': 'off',
    'no-useless-return': 'off',
    'no-array-constructor': 'off',
    'vue/no-unused-vars': 'off',
    'prefer-promise-reject-errors': 'off',
    'valid-typeof': 'off',
    'dot-notation': 'off'
  },

  globals: {},

  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2022
  },

  overrides: [
    {
      files: ['tests/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
