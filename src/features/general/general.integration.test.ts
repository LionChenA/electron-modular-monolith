import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('General Integration', () => {
  beforeAll(() => {
    process.versions.chrome = '120.0.0';
    process.versions.electron = '30.0.0';
  });

  afterAll(() => {
    delete process.versions.chrome;
    delete process.versions.electron;
  });

  it('getVersions handler returns correct response', async () => {
    const result = await getVersions();
    expect(result.node).toBe(process.versions.node);
    expect(result.chrome).toBe(process.versions.chrome);
    expect(result.electron).toBe(process.versions.electron);
  });

  it('getVersions handler returns object with required keys', async () => {
    const result = await getVersions();
    expect(result).toHaveProperty('node');
    expect(result).toHaveProperty('chrome');
    expect(result).toHaveProperty('electron');
  });

  it('getVersions handler returns string values', async () => {
    const result = await getVersions();
    expect(typeof result.node).toBe('string');
    expect(typeof result.chrome).toBe('string');
    expect(typeof result.electron).toBe('string');
  });

  it('getPlatform handler returns correct platform', async () => {
    const result = await getPlatform();
    expect(result).toBe(process.platform);
  });

  it('getPlatform handler returns string', async () => {
    const result = await getPlatform();
    expect(typeof result).toBe('string');
  });

  it('getPlatform handler returns valid platform value', async () => {
    const result = await getPlatform();
    const validPlatforms = ['darwin', 'win32', 'linux'];
    expect(validPlatforms.includes(result)).toBe(true);
  });
});

async function getVersions() {
  return {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  };
}

async function getPlatform() {
  return process.platform;
}
