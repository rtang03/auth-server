module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  ignorePatterns: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    '@typescript-eslint/tslint',
    'eslint-plugin-prettier',
    'eslint-plugin-import',
    'eslint-plugin-standard',
    'eslint-plugin-prefer-arrow',
    'jest'
  ],
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': ['off'],
    'prettier/prettier': ['off'],
    'arrow-body-style': 'off',
    curly: 'off',
    'lines-around-comment': [0],
    'max-len': 'off',
    'no-confusing-arrow': [0],
    'no-mixed-operators': [0],
    'no-tabs': [0],
    'no-unexpected-multiline': [0],
    'prefer-arrow-callback': [0],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'array-bracket-newline': ['off'],
    'array-bracket-spacing': ['off'],
    'array-element-newline': ['off'],
    'arrow-parens': ['off', 'as-needed'],
    'arrow-spacing': ['off'],
    'block-spacing': ['off'],
    'brace-style': ['off'],
    'comma-dangle': 'off',
    'comma-spacing': ['off'],
    'comma-style': ['off'],
    'computed-property-spacing': ['off'],
    'dot-location': ['off'],
    'eol-last': 'off',
    'func-call-spacing': ['off'],
    'function-call-argument-newline': ['off'],
    'function-paren-newline': ['off'],
    'generator-star': ['off'],
    'generator-star-spacing': ['off'],
    'implicit-arrow-linebreak': ['off'],
    'jsx-quotes': ['off'],
    'key-spacing': ['off'],
    'keyword-spacing': ['off'],
    'linebreak-style': ['error', 'unix'],
    'multiline-ternary': ['off'],
    'newline-per-chained-call': 'off',
    'new-parens': 'off',
    'no-arrow-condition': ['off'],
    'no-comma-dangle': ['off'],
    'no-extra-parens': ['off'],
    'no-extra-semi': 'off',
    'no-floating-decimal': ['off'],
    'no-mixed-spaces-and-tabs': ['off'],
    'no-multi-spaces': ['off'],
    'no-multiple-empty-lines': 'off',
    'no-reserved-keys': ['off'],
    'no-space-before-semi': ['off'],
    'no-trailing-spaces': 'off',
    'no-whitespace-before-property': ['off'],
    'no-wrap-func': ['off'],
    'nonblock-statement-body-position': ['off'],
    'object-curly-newline': ['off'],
    'object-curly-spacing': ['off'],
    'object-property-newline': ['off'],
    'one-var-declaration-per-line': ['off'],
    'operator-linebreak': ['off'],
    'padded-blocks': ['off'],
    'quote-props': 'off',
    'rest-spread-spacing': ['off'],
    semi: ['off'],
    'semi-spacing': ['off'],
    'semi-style': ['off'],
    'space-after-function-name': ['off'],
    'space-after-keywords': ['off'],
    'space-before-blocks': ['off'],
    'space-before-function-paren': 'off',
    'space-before-function-parentheses': ['off'],
    'space-before-keywords': ['off'],
    'space-in-brackets': ['off'],
    'space-in-parens': ['off', 'never'],
    'space-infix-ops': ['off'],
    'space-return-throw-case': ['off'],
    'space-unary-ops': ['off'],
    'space-unary-word-ops': ['off'],
    'switch-colon-spacing': ['off'],
    'template-curly-spacing': ['off'],
    'template-tag-spacing': ['off'],
    'unicode-bom': ['off'],
    'wrap-iife': ['off'],
    'wrap-regex': ['off'],
    'yield-star-spacing': ['off'],
    'no-spaced-func': ['off'],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false
      }
    ],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint': ['off'],
    '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/brace-style': ['off'],
    '@typescript-eslint/comma-spacing': ['off'],
    '@typescript-eslint/func-call-spacing': ['off'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-extra-parens': ['off'],
    '@typescript-eslint/no-extra-semi': ['off'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': ['off'],
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/ban-ts-ignore': ['off'],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/interface-name-prefix': 'off',
    'no-array-constructor': ['off'],
    '@typescript-eslint/no-array-constructor': ['error'],
    'no-empty-function': ['off'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': ['error'],
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': ['warn'],
    '@typescript-eslint/no-this-alias': ['error'],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-rest-params': ['error'],
    'prefer-spread': ['error'],
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit'
      }
    ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    complexity: 'off',
    'constructor-super': 'error',
    'dot-notation': 'off',
    eqeqeq: ['error', 'always'],
    'guard-for-in': 'error',
    'id-blacklist': 'off',
    'id-match': 'off',
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
    'max-classes-per-file': 'off',
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-debugger': 'error',
    'no-empty': 'off',
    'no-eval': 'error',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'off',
    'no-new-wrappers': 'error',
    'no-shadow': [
      'off',
      {
        hoist: 'all'
      }
    ],
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'off',
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'off',
    'no-unused-labels': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow/prefer-arrow-functions': 'error',
    radix: 'error',
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'valid-typeof': 'off',
    '@typescript-eslint/tslint/config': [
      'error',
      {
        rules: {
          'jsdoc-format': false,
          'no-reference-import': true
        }
      }
    ],
    '@typescript-eslint/unbound-method': ['off', { ignoreStatic: false }]
  },
  settings: {}
};
