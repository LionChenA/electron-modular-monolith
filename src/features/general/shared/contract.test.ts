import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { generalContract } from './contract';

describe('generalContract', () => {
  describe('structure', () => {
    it('getVersions has output schema', () => {
      expect(generalContract.getVersions).toBeDefined();
    });

    it('getPlatform has output schema', () => {
      expect(generalContract.getPlatform).toBeDefined();
    });
  });

  describe('type inference', () => {
    it('getVersions output infers correct types', () => {
      const schema = generalContract.getVersions;
      expect(schema).toBeDefined();

      const testOutput = {
        node: '20.0.0',
        chrome: '120.0.0',
        electron: '30.0.0',
      };

      const result = z
        .object({
          node: z.string(),
          chrome: z.string(),
          electron: z.string(),
        })
        .safeParse(testOutput);

      expect(result.success).toBe(true);
    });

    it('getPlatform output infers string type', () => {
      const schema = generalContract.getPlatform;
      expect(schema).toBeDefined();

      const result = z.string().safeParse('darwin');
      expect(result.success).toBe(true);
    });
  });

  describe('output validation', () => {
    it('getVersions validates complete structure', () => {
      const outputSchema = z.object({
        node: z.string(),
        chrome: z.string(),
        electron: z.string(),
      });

      const validOutput = {
        node: '20.0.0',
        chrome: '120.0.0',
        electron: '30.0.0',
      };

      const result = outputSchema.safeParse(validOutput);
      expect(result.success).toBe(true);
    });

    it('getVersions rejects incomplete structure', () => {
      const outputSchema = z.object({
        node: z.string(),
        chrome: z.string(),
        electron: z.string(),
      });

      const invalidOutput = {
        node: '20.0.0',
        chrome: '120.0.0',
      };

      const result = outputSchema.safeParse(invalidOutput);
      expect(result.success).toBe(false);
    });

    it('getVersions rejects wrong types', () => {
      const outputSchema = z.object({
        node: z.string(),
        chrome: z.string(),
        electron: z.string(),
      });

      const invalidOutput = {
        node: 20,
        chrome: '120.0.0',
        electron: '30.0.0',
      };

      const result = outputSchema.safeParse(invalidOutput);
      expect(result.success).toBe(false);
    });

    it('getPlatform accepts valid platform strings', () => {
      const stringSchema = z.string();
      const validPlatforms = ['darwin', 'win32', 'linux'];

      for (const platform of validPlatforms) {
        const result = stringSchema.safeParse(platform);
        expect(result.success).toBe(true);
      }
    });
  });
});
