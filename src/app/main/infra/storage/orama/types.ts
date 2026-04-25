import type { SearchableType } from '@orama/orama';

export type SearchAlgorithm = 'bm25' | 'qps' | 'pt15';

export type OramaSchema = {
  [key: string]: SearchableType | OramaSchema | OramaSchema[];
};

export interface SearchParams {
  term?: string;
  mode?: 'fulltext' | 'vector' | 'hybrid';
  vector?: {
    value: number[];
    property: string;
  };
  similarity?: number;
  includeVectors?: boolean;
  limit?: number;
  offset?: number;
  where?: Record<string, unknown>;
  properties?: string[];
}

export interface SearchResult<T = Record<string, unknown>> {
  elapsed: {
    raw: number;
    formatted: string;
  };
  hits: Array<{
    id: string;
    score: number;
    document: T;
  }>;
  count: number;
}

export interface CreateOramaOptions {
  schema: OramaSchema;
  algorithm?: SearchAlgorithm;
  persistence?: {
    filePath?: string;
    format?: 'json' | 'binary';
    autoSaveInterval?: number;
  };
}

export interface ISearchEngine {
  insert<T = Record<string, unknown>>(document: T): Promise<string>;
  insertMany<T = Record<string, unknown>>(documents: T[]): Promise<string[]>;
  update<T = Record<string, unknown>>(id: string, document: T): Promise<void>;
  remove(id: string): Promise<void>;
  search<T = Record<string, unknown>>(params: SearchParams): Promise<SearchResult<T>>;
  searchVector<T = Record<string, unknown>>(
    vector: number[],
    property: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<T>>;
  searchHybrid<T = Record<string, unknown>>(
    term: string,
    vector: number[],
    vectorProperty: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<T>>;
  save(): Promise<void>;
  close(): Promise<void>;
  getInternalDb(): unknown;
}
