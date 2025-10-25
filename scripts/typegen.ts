import fs from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import {
  combine,
  formatters,
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
} from '../src';

const configs = await combine(
  {
    plugins: {
      '': {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  javascript(),
  typescript(),
  formatters(),
  jsonc(),
  jsx(),
  perfectionist(),
  sortPackageJson(),
  sortTsconfig(),
  stylistic(),
  jsdoc(),
  test(),
  vue(),
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`;

await fs.writeFile('src/typegen.d.ts', dts);
