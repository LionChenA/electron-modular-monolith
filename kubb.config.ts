import { defineConfig } from '@kubb/core';
import { pluginFaker } from '@kubb/plugin-faker';
import { pluginMsw } from '@kubb/plugin-msw';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';

export default defineConfig({
  root: '.',
  input: {
    path: './test/mocks/openapi.json',
  },
  output: {
    path: './test/mocks/gen',
    clean: true,
    barrelType: 'named',
    extension: {
      '.ts': '',
    },
  },
  plugins: [
    pluginOas({
      validate: true,
    }),
    pluginTs({
      output: {
        path: 'types.ts',
        barrelType: false,
      },
      enumType: 'asConst',
    }),
    pluginZod({
      output: {
        path: 'zod',
      },
      group: { type: 'tag' },
      typed: true,
    }),
    pluginFaker({
      output: {
        path: 'faker',
      },
      group: { type: 'tag' },
    }),
    pluginMsw({
      output: {
        path: 'msw',
      },
      group: { type: 'tag' },
    }),
  ],
});
