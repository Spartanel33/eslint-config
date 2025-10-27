import type { Linter } from 'eslint';

import type { RuleOptions } from './typegen';
import type {
  Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem,
} from './types';

import { FlatConfigComposer } from 'eslint-flat-config-utils';

import {
  formatters,
  ignores,
  javascript,
  jsdoc,
  jsonc,
  jsx,
  perfectionist,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  test,
  typescript,
  vue,
  yaml,
} from './configs';

const flatConfigProps = [
  'name',
  'languageOptions',
  'linterOptions',
  'processor',
  'plugins',
  'rules',
  'settings',
] satisfies (keyof TypedFlatConfigItem)[];

export const defaultPluginRenaming = {
  '@typescript-eslint': 'ts',
  'import-lite': 'import',
  'vitest': 'test',
  '@stylistic': 'style',
  'yml': 'yaml',
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function kadesy(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    autoRenamePlugins = true,
    componentExts = [],
    typescript: enableTypeScript = true,
    vue: enableVue = true,
    jsx: enableJsx = true,
    formatters: formattersOptions = true,
    perfectionist: enablePerfectionist = true,
  } = options;

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {};

  if (stylisticOptions && !('jsx' in stylisticOptions))
    stylisticOptions.jsx = typeof enableJsx === 'object' ? true : enableJsx;

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

  const typescriptOptions = resolveSubOptions(options, 'typescript');

  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      overrides: getOverrides(options, 'javascript'),
    }),
    jsdoc({
      stylistic: stylisticOptions,
    }),
  );

  if (enablePerfectionist) {
    configs.push(
      perfectionist({
        overrides: getOverrides(options, 'perfectionist'),
      }),
    );
  }

  if (enableVue) {
    componentExts.push('vue');
  }

  if (options.test ?? true) {
    configs.push(test({
      overrides: getOverrides(options, 'test'),
    }));
  }

  if (enableTypeScript) {
    configs.push(
      typescript({
        ...typescriptOptions,
        componentExts,
        overrides: getOverrides(options, 'typescript'),
        type: options.type,
      }),
    );
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }));
  }

  if (enableVue) {
    configs.push(
      vue({
        ...resolveSubOptions(options, 'vue'),
        overrides: getOverrides(options, 'vue'),
        stylistic: stylisticOptions,
        typescript: !!enableTypeScript,
      }),
    );
  }

  if (enableJsx) {
    configs.push(jsx(enableJsx === true ? {} : enableJsx));
  }

  if (formattersOptions) {
    configs.push(formatters(formattersOptions));
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc'),
        stylistic: stylisticOptions,
      }),
      sortPackageJson(),
      sortTsconfig(),
    );
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml'),
        stylistic: stylisticOptions,
      }),
    );
  }

  if ('files' in options) {
    throw new Error(
      '[@kadesy/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
    );
  }

  // User can optionally pass a flat config item to the first argument
  // We pick the known keys as ESLint would do schema validation
  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length) configs.push([fusedConfig]);

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

  composer = composer.append(...configs, ...(userConfigs as any));

  if (autoRenamePlugins) {
    composer = composer.renamePlugins(defaultPluginRenaming);
  }

  return composer;
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean' ? ({} as any) : options[key] || ({} as any);
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...('overrides' in sub ? sub.overrides : {}),
  };
}
