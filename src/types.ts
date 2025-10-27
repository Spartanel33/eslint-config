import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin';
import type { ParserOptions } from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import type { Options as VueBlocksOptions } from 'eslint-processor-vue-blocks';

import type { ConfigNames, RuleOptions } from './typegen';

export type { ConfigNames };

import type { VendoredPrettierOptions } from './prettier-types';

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions;

export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */
  plugins?: Record<string, any>;

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules;
};

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules'];
}

export interface StylisticConfig extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig;
}

export interface OptionsHasTypeScript {
  typescript?: boolean;
}

export type Awaitable<T> = T | Promise<T>;

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[];
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[];
}

export interface OptionsTypeScriptParserOptions {
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>;
}

export interface OptionsProjectType {
  /**
   * Type of the project. `lib` will enable more strict rules for libraries.
   *
   * @default 'app'
   */
  type?: 'app' | 'lib';
}

export type BuiltInParserName
  = | 'acorn'
    | 'angular'
    | 'babel-flow'
    | 'babel-ts'
    | 'babel'
    | 'css'
    | 'espree'
    | 'flow'
    | 'glimmer'
    | 'graphql'
    | 'html'
    | 'json-stringify'
    | 'json'
    | 'json5'
    | 'less'
    | 'lwc'
    | 'markdown'
    | 'mdx'
    | 'meriyah'
    | 'scss'
    | 'typescript'
    | 'vue'
    | 'xml'
    | 'yaml';

export type ExternalParserName = 'slidev' | 'astro';

export interface VendoredPrettierOptionsRequired {
  /**
   * Specify the line length that the printer will wrap on.
   * @default 120
   */
  printWidth: number;
  /**
   * Specify the number of spaces per indentation-level.
   */
  tabWidth: number;
  /**
   * Indent lines with tabs instead of spaces
   */
  useTabs?: boolean;
  /**
   * Print semicolons at the ends of statements.
   */
  semi: boolean;
  /**
   * Use single quotes instead of double quotes.
   */
  singleQuote: boolean;
  /**
   * Use single quotes in JSX.
   */
  jsxSingleQuote: boolean;
  /**
   * Print trailing commas wherever possible.
   */
  trailingComma: 'none' | 'es5' | 'all';
  /**
   * Print spaces between brackets in object literals.
   */
  bracketSpacing: boolean;
  /**
   * Put the `>` of a multi-line HTML (HTML, XML, JSX, Vue, Angular) element at the end of the last line instead of being
   * alone on the next line (does not apply to self closing elements).
   */
  bracketSameLine: boolean;
  /**
   * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
   * @deprecated use bracketSameLine instead
   */
  jsxBracketSameLine: boolean;
  /**
   * Format only a segment of a file.
   */
  rangeStart: number;
  /**
   * Format only a segment of a file.
   * @default Number.POSITIVE_INFINITY
   */
  rangeEnd: number;
  /**
   * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
   * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
   * @default "preserve"
   */
  proseWrap: 'always' | 'never' | 'preserve';
  /**
   * Include parentheses around a sole arrow function parameter.
   * @default "always"
   */
  arrowParens: 'avoid' | 'always';
  /**
   * Provide ability to support new languages to prettier.
   */
  plugins: Array<string | any>;
  /**
   * How to handle whitespaces in HTML.
   * @default "css"
   */
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
  /**
   * Which end of line characters to apply.
   * @default "lf"
   */
  endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
  /**
   * Change when properties in objects are quoted.
   * @default "as-needed"
   */
  quoteProps: 'as-needed' | 'consistent' | 'preserve';
  /**
   * Whether or not to indent the code inside <script> and <style> tags in Vue files.
   * @default false
   */
  vueIndentScriptAndStyle: boolean;
  /**
   * Enforce single attribute per line in HTML, XML, Vue and JSX.
   * @default false
   */
  singleAttributePerLine: boolean;

  /**
   * How to handle whitespaces in XML.
   * @default "preserve"
   */
  xmlQuoteAttributes: 'single' | 'double' | 'preserve';
  /**
   * Whether to put a space inside the brackets of self-closing XML elements.
   * @default true
   */
  xmlSelfClosingSpace: boolean;
  /**
   * Whether to sort attributes by key in XML elements.
   * @default false
   */
  xmlSortAttributesByKey: boolean;
  /**
   * How to handle whitespaces in XML.
   * @default "ignore"
   */
  xmlWhitespaceSensitivity: 'ignore' | 'strict' | 'preserve';
}

export interface OptionsFormatters {
  /**
   * Enable formatting support for CSS/SCSS.
   */
  css?: boolean;

  /**
   * Enable formatting support for HTML.
   */
  html?: boolean;

  /**
   * Enable formatting support for XML.
   */
  xml?: boolean;

  /**
   * Enable formatting support for SVG.
   */
  svg?: boolean;

  /**
   * Custom options for Prettier.
   *
   * By default it's controlled by our own config.
   */
  prettierOptions?: VendoredPrettierOptions;
}

export interface OptionsJSXA11y extends OptionsOverrides {
  // Add future a11y-specific options here
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * Requires installing:
   * - `eslint-plugin-jsx-a11y`
   *
   * Can be a boolean or an object for custom options and overrides.
   * @default false
   */
  a11y?: boolean | OptionsJSXA11y;
}

export type OptionsTypescript = OptionsTypeScriptParserOptions & OptionsOverrides;

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  /**
   * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
   *
   * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
   * @default false
   */
  a11y?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides);
  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides;

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript;

  /**
   * Enable JSX related rules.
   *
   * Passing an object to enable JSX accessibility rules.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX;

  /**
   * Enable test support.
   *
   * @default true
   */
  test?: boolean | OptionsOverrides;

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;

  /**
   * Enable JSONC support.
   *
   * @default true
   */
  jsonc?: boolean | OptionsOverrides;

  /**
   * Enable YAML support.
   *
   * @default true
   */
  yaml?: boolean | OptionsOverrides;

  /**
   * Use external formatters to format files.
   *
   * When set to `true`, it will enable all formatters.
   *
   * @default false
   */
  formatters?: boolean | OptionsFormatters;

  /**
   * Enable perfectionist plugin for props and items sorting.
   *
   * @see https://github.com/azat-io/eslint-plugin-perfectionist
   *
   * @default true
   */
  perfectionist?: boolean | OptionsOverrides;

  /**
   * Automatically rename plugins in the config.
   *
   * @default true
   */
  autoRenamePlugins?: boolean;
}
