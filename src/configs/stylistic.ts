import type {
  OptionsOverrides, StylisticConfig, TypedFlatConfigItem,
} from '../types';

import { interopDefault } from '../utils';

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: true,
};

export type StylisticOptions = StylisticConfig & OptionsOverrides;

export async function stylistic(options: StylisticOptions = {}): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...options,
  };

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'));

  const config = pluginStylistic.configs.customize({
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi,
  }) as TypedFlatConfigItem;

  return [
    {
      name: 'kadesy/stylistic/rules',
      plugins: {
        style: pluginStylistic,
      },
      rules: {
        ...config.rules,
        'style/generator-star-spacing': [
          'error',
          {
            after: true,
            before: false,
          },
        ],
        'style/brace-style': ['error', '1tbs'],
        'style/quote-props': ['error', 'as-needed'],
        'style/function-call-argument-newline': ['error', 'consistent'],
        'style/function-paren-newline': ['error', 'consistent'],
        'style/yield-star-spacing': [
          'error',
          {
            after: true,
            before: false,
          },
        ],
        'style/object-curly-newline': [
          'error',
          {
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
          },
        ],
        'style/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        ...overrides,
      },
    },
  ];
}
