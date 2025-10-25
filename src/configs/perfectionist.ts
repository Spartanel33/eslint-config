import type { OptionsOverrides, TypedFlatConfigItem } from '../types';

import pluginPerfectionist from 'eslint-plugin-perfectionist';

/**
 * Perfectionist plugin for props and items sorting.
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export async function perfectionist(options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> {
  const { overrides } = options;
  return [
    {
      name: 'kadesy/perfectionist/setup',
      plugins: {
        perfectionist: pluginPerfectionist,
      },
      rules: {
        'perfectionist/sort-exports': ['error', { order: 'asc', type: 'alphabetical' }],
        'perfectionist/sort-imports': [
          'error',
          {
            groups: [
              'type',
              ['parent-type', 'sibling-type', 'index-type', 'internal-type'],

              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'object',
              'unknown',
            ],
            newlinesBetween: 1,
            order: 'asc',
            type: 'alphabetical',
          },
        ],
        'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'alphabetical' }],
        'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'alphabetical' }],
        ...overrides,
      },
    },
  ];
}
