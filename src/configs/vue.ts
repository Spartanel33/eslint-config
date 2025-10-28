import type {
  OptionsFiles, OptionsHasTypeScript, OptionsOverrides, OptionsStylistic, OptionsVue, TypedFlatConfigItem,
} from '../types';

import { mergeProcessors } from 'eslint-merge-processors';

import { GLOB_VUE } from '../globs';
import { interopDefault } from '../utils';

export async function vue(
  options: OptionsVue & OptionsHasTypeScript & OptionsOverrides & OptionsFiles & OptionsStylistic = {},
): Promise<TypedFlatConfigItem[]> {
  const {
    a11y = false, files = [GLOB_VUE], overrides = {}, stylistic = true,
  } = options;

  const sfcBlocks = options.sfcBlocks === true ? {} : (options.sfcBlocks ?? {});

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic;

  const [pluginVue, parserVue, processorVueBlocks, pluginVueA11y] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    interopDefault(import('eslint-processor-vue-blocks')),
    ...(a11y ? [interopDefault(import('eslint-plugin-vuejs-accessibility'))] : []),
  ] as const);

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      name: 'kadesy/vue/setup',
      plugins: {
        vue: pluginVue,
        ...(a11y ? { 'vue-a11y': pluginVueA11y } : {}),
      },
    },
    {
      files,
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript ? ((await interopDefault(import('@typescript-eslint/parser'))) as any) : null,
          sourceType: 'module',
        },
      },
      name: 'kadesy/vue/rules',
      processor: sfcBlocks === false
        ? pluginVue.processors['.vue']
        : mergeProcessors([
            pluginVue.processors['.vue'],
            processorVueBlocks({
              ...sfcBlocks,
              blocks: {
                styles: true,
                ...sfcBlocks.blocks,
              },
            }),
          ]),
      rules: {
        ...pluginVue.configs.base.rules,
        'ts/explicit-function-return-type': 'off',
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        'vue/attribute-hyphenation': 'error',
        'vue/component-definition-name-casing': 'error',
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          { registeredComponentsOnly: false },
        ],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/html-self-closing': 'error',
        'vue/no-template-shadow': 'error',
        'vue/require-explicit-emits': 'error',
        'vue/one-component-per-file': 'error',
        'vue/custom-event-name-casing': ['error', 'kebab-case', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }],
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
          },
        ],
        'vue/no-empty-component-block': 'error',
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/no-multiple-objects-in-class': 'error',
        'vue/no-required-prop-with-default': 'error',
        'vue/define-props-declaration': ['error', 'type-based'],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/no-useless-mustaches': 'error',
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'error',
        'vue/no-dupe-keys': 'error',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-v-text': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/html-indent': ['error', indent],
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/v-bind-style': 'error',
        'vue/require-prop-types': 'error',
        'vue/v-on-style': 'error',
        'vue/v-slot-style': 'error',
        'vue/define-emits-declaration': ['error', 'type-based'],
        'vue/v-on-event-hyphenation': [
          'error',
          'always',
          {
            autofix: true,
          },
        ],
        'vue/attributes-order': [
          'error',
          {
            order: [
              'DEFINITION',
              'LIST_RENDERING',
              'CONDITIONALS',
              'RENDER_MODIFIERS',
              'TWO_WAY_BINDING',
              'OTHER_DIRECTIVES',
              ['UNIQUE', 'SLOT'],
              'GLOBAL',
              'OTHER_ATTR',
              'EVENTS',
              'CONTENT',
            ],
            alphabetical: true,
          },
        ],
        'vue/no-lone-template': 'error',
        'vue/no-multiple-slot-args': 'error',
        'vue/space-infix-ops': 'error',
        'vue/this-in-template': 'error',

        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/no-constant-condition': 'error',
        'vue/no-useless-concat': 'error',

        ...stylistic
          ? {
              'vue/array-bracket-spacing': ['error', 'never'],
              'vue/arrow-spacing': ['error', { after: true, before: true }],
              'vue/block-spacing': ['error', 'always'],
              'vue/block-tag-newline': ['error', {
                multiline: 'always',
                singleline: 'always',
              }],
              'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
              'vue/comma-dangle': ['error', 'always-multiline'],
              'vue/comma-spacing': ['error', { after: true, before: false }],
              'vue/comma-style': ['error', 'last'],
              'vue/html-comment-content-spacing': ['error', 'always', {
                exceptions: ['-'],
              }],
              'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'vue/keyword-spacing': ['error', { after: true, before: true }],
              'vue/object-curly-newline': ['error', {
                ObjectExpression: {
                  minProperties: 3,
                  multiline: true,
                  consistent: true,
                },
                ObjectPattern: {
                  minProperties: 3,
                  multiline: true,
                  consistent: true,
                },
                ImportDeclaration: {
                  minProperties: 3,
                  multiline: true,
                  consistent: true,
                },
                ExportDeclaration: {
                  minProperties: 3,
                  multiline: true,
                  consistent: true,
                },
              }],
              'vue/object-curly-spacing': ['error', 'always'],
              'vue/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
              'vue/operator-linebreak': ['error', 'before'],
              'vue/padding-line-between-blocks': ['error', 'always'],
              'vue/quote-props': ['error', 'consistent-as-needed'],
              'vue/space-in-parens': ['error', 'never'],
              'vue/template-curly-spacing': 'error',
              'vue/prefer-define-options': 'error',
              'vue/prefer-true-attribute-shorthand': 'error',
              'vue/require-explicit-slots': 'error',
              'vue/require-macro-variable-name': 'error',
              'vue/require-typed-ref': 'error',
              'vue/v-for-delimiter-style': 'error',
              'vue/v-on-handler-style': [
                'error',
                ['method', 'inline-function'],
                { ignoreIncludesComment: false },
              ],
            }
          : {},

        ...(a11y
          ? {
              'vue-a11y/alt-text': 'error',
              'vue-a11y/anchor-has-content': 'error',
              'vue-a11y/aria-props': 'error',
              'vue-a11y/aria-role': 'error',
              'vue-a11y/aria-unsupported-elements': 'error',
              'vue-a11y/click-events-have-key-events': 'error',
              'vue-a11y/form-control-has-label': 'error',
              'vue-a11y/heading-has-content': 'error',
              'vue-a11y/iframe-has-title': 'error',
              'vue-a11y/interactive-supports-focus': 'error',
              'vue-a11y/label-has-for': 'error',
              'vue-a11y/media-has-caption': 'warn',
              'vue-a11y/mouse-events-have-key-events': 'error',
              'vue-a11y/no-access-key': 'error',
              'vue-a11y/no-aria-hidden-on-focusable': 'error',
              'vue-a11y/no-autofocus': 'warn',
              'vue-a11y/no-distracting-elements': 'error',
              'vue-a11y/no-redundant-roles': 'error',
              'vue-a11y/no-role-presentation-on-focusable': 'error',
              'vue-a11y/no-static-element-interactions': 'error',
              'vue-a11y/role-has-required-aria-props': 'error',
              'vue-a11y/tabindex-no-positive': 'warn',
            }
          : {}),

        ...overrides,
      },
    },
  ];
}
