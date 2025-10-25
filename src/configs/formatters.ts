import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../prettier-types';
import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '../types';

import {
  GLOB_CSS,
  GLOB_HTML,
  GLOB_SCSS,
  GLOB_SVG,
  GLOB_XML,
} from '../globs';
import { interopDefault, parserPlain } from '../utils';
import { StylisticConfigDefaults } from './stylistic';

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [...(overrides.plugins || []), ...(options.plugins || [])],
  };
}

export async function formatters(
  options: OptionsFormatters | true = {},
  stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    options = {
      css: true,
      html: true,
      svg: true,
      xml: true,
    };
  }

  const {
    indent, quotes, semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  };

  const prettierOptions: VendoredPrettierOptions = Object.assign(
    {
      endOfLine: 'auto',
      printWidth: 120,
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    } satisfies VendoredPrettierOptions,
    options.prettierOptions || {},
  );

  const prettierXmlOptions: VendoredPrettierOptions = {
    xmlQuoteAttributes: 'double',
    xmlSelfClosingSpace: true,
    xmlSortAttributesByKey: false,
    xmlWhitespaceSensitivity: 'ignore',
  };

  const pluginFormat = await interopDefault(import('eslint-plugin-format'));

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'kadesy/formatter/setup',
      plugins: {
        format: pluginFormat,
      },
    },
  ];

  if (options.css) {
    configs.push(
      {
        files: [GLOB_CSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'kadesy/formatter/css',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'css',
            }),
          ],
        },
      },
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: parserPlain,
        },
        name: 'kadesy/formatter/scss',
        rules: {
          'format/prettier': [
            'error',
            mergePrettierOptions(prettierOptions, {
              parser: 'scss',
            }),
          ],
        },
      },
    );
  }

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'kadesy/formatter/html',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html',
          }),
        ],
      },
    });
  }

  if (options.xml) {
    configs.push({
      files: [GLOB_XML],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'kadesy/formatter/xml',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: ['@prettier/plugin-xml'],
            },
          ),
        ],
      },
    });
  }
  if (options.svg) {
    configs.push({
      files: [GLOB_SVG],
      languageOptions: {
        parser: parserPlain,
      },
      name: 'kadesy/formatter/svg',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(
            { ...prettierXmlOptions, ...prettierOptions },
            {
              parser: 'xml',
              plugins: ['@prettier/plugin-xml'],
            },
          ),
        ],
      },
    });
  }

  return configs;
}
