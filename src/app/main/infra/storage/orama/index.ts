import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  type AnyOrama,
  create,
  insert,
  insertMultiple,
  remove,
  search,
  update,
} from '@orama/orama';
import type {
  CreateOramaOptions,
  ISearchEngine,
  OramaSchema,
  SearchParams,
  SearchResult,
} from './types';

let autoSaveInterval: ReturnType<typeof setInterval> | null = null;

export async function createOrama(options: CreateOramaOptions): Promise<ISearchEngine> {
  const { schema, persistence } = options;

  let db: AnyOrama;

  // Try to load from file if persistence is configured
  if (persistence?.filePath) {
    try {
      const fileExists = await fileExistsCheck(persistence.filePath);
      if (fileExists) {
        const data = await fs.readFile(persistence.filePath, 'utf-8');
        const parsed = JSON.parse(data);
        db = await restoreFromJson(parsed);
      } else {
        db = await createDatabase(schema);
      }
    } catch {
      // If loading fails, create a new database
      db = await createDatabase(schema);
    }
  } else {
    db = await createDatabase(schema);
  }

  const oramaService = new OramaService(db, persistence);

  // Set up auto-save if configured
  if (persistence?.autoSaveInterval && persistence?.filePath) {
    autoSaveInterval = setInterval(async () => {
      try {
        await oramaService.save();
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, persistence.autoSaveInterval);
  }

  return oramaService;
}

async function createDatabase(schema: OramaSchema): Promise<AnyOrama> {
  return create({
    schema: schema as Parameters<typeof create>[0]['schema'],
  });
}

async function fileExistsCheck(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function restoreFromJson(data: unknown): Promise<AnyOrama> {
  const { load } = await import('@orama/orama');
  const db = create({ schema: {} });
  load(db, data as Parameters<typeof load>[1]);
  return db;
}

class OramaService implements ISearchEngine {
  private db: AnyOrama;
  private persistence: CreateOramaOptions['persistence'] | undefined;
  private closed = false;

  constructor(db: AnyOrama, persistence?: CreateOramaOptions['persistence']) {
    this.db = db;
    this.persistence = persistence;
  }

  async insert<T = Record<string, unknown>>(document: T): Promise<string> {
    this.ensureNotClosed();
    return insert(this.db, document as Record<string, unknown>);
  }

  async insertMany<T = Record<string, unknown>>(documents: T[]): Promise<string[]> {
    this.ensureNotClosed();
    return insertMultiple(this.db, documents as Record<string, unknown>[]);
  }

  async update<T = Record<string, unknown>>(id: string, document: T): Promise<void> {
    this.ensureNotClosed();
    await update(this.db, id, document as Record<string, unknown>);
  }

  async remove(id: string): Promise<void> {
    this.ensureNotClosed();
    await remove(this.db, id);
  }

  async search<T = Record<string, unknown>>(params: SearchParams): Promise<SearchResult<T>> {
    this.ensureNotClosed();
    const searchParams: Record<string, unknown> = {
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
    };

    if (params.term) {
      searchParams.term = params.term;
    }
    if (params.mode) {
      searchParams.mode = params.mode;
    }
    if (params.vector) {
      searchParams.vector = params.vector;
    }
    if (params.similarity !== undefined) {
      searchParams.similarity = params.similarity;
    }
    if (params.includeVectors !== undefined) {
      searchParams.includeVectors = params.includeVectors;
    }
    if (params.where) {
      searchParams.where = params.where;
    }
    if (params.properties) {
      searchParams.properties = params.properties;
    }

    const result = await search(this.db, searchParams);

    return {
      elapsed: result.elapsed,
      hits: result.hits.map((hit) => ({
        id: hit.id,
        score: hit.score,
        document: hit.document as T,
      })),
      count: result.count,
    };
  }

  async searchVector<T = Record<string, unknown>>(
    vector: number[],
    property: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<T>> {
    return this.search<T>({
      mode: 'vector',
      vector: {
        value: vector,
        property: property,
      },
      similarity: options?.similarity,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      where: options?.where,
    });
  }

  async searchHybrid<T = Record<string, unknown>>(
    term: string,
    vector: number[],
    vectorProperty: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<T>> {
    return this.search<T>({
      term: term,
      mode: 'hybrid',
      vector: {
        value: vector,
        property: vectorProperty,
      },
      similarity: options?.similarity,
      limit: options?.limit ?? 10,
      offset: options?.offset ?? 0,
      where: options?.where,
    });
  }

  async save(): Promise<void> {
    this.ensureNotClosed();
    if (!this.persistence?.filePath) {
      throw new Error('Persistence file path not configured');
    }

    const { save } = await import('@orama/orama');
    const data = save(this.db);

    // Ensure directory exists
    const dir = path.dirname(this.persistence.filePath);
    await fs.mkdir(dir, { recursive: true });

    // Save based on format
    if (this.persistence.format === 'binary') {
      // For binary, we'd need the persistence plugin
      // For now, save as JSON
      await fs.writeFile(this.persistence.filePath, JSON.stringify(data), 'utf-8');
    } else {
      await fs.writeFile(this.persistence.filePath, JSON.stringify(data), 'utf-8');
    }
  }

  async close(): Promise<void> {
    this.ensureNotClosed();

    // Clear auto-save interval
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
      autoSaveInterval = null;
    }

    // Save before closing if persistence is configured
    if (this.persistence?.filePath) {
      await this.save();
    }

    this.closed = true;
  }

  getInternalDb(): unknown {
    return this.db;
  }

  private ensureNotClosed(): void {
    if (this.closed) {
      throw new Error('Orama search engine has been closed');
    }
  }
}

export type {
  CreateOramaOptions,
  ISearchEngine,
  OramaSchema,
  SearchParams,
  SearchResult,
} from './types';
