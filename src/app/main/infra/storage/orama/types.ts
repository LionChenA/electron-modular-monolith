import type { SearchableType } from '@orama/orama';

export type SearchAlgorithm = 'bm25' | 'qps' | 'pt15';

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: number;
  updatedAt: number;
  [key: string]: string | number | boolean | null | undefined;
}

export type OramaSchema = {
  [key: string]: SearchableType | OramaSchema | OramaSchema[];
};

export const DEFAULT_SEARCH_SCHEMA: OramaSchema = {
  id: 'string',
  title: 'string',
  content: 'string',
  type: 'string',
  createdAt: 'number',
  updatedAt: 'number',
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
  insert(document: Record<string, unknown>): Promise<string>;
  insertMany(documents: Record<string, unknown>[]): Promise<string[]>;
  update(id: string, document: Record<string, unknown>): Promise<void>;
  remove(id: string): Promise<void>;
  search(params: SearchParams): Promise<SearchResult<Record<string, unknown>>>;
  searchVector(
    vector: number[],
    property: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<Record<string, unknown>>>;
  searchHybrid(
    term: string,
    vector: number[],
    vectorProperty: string,
    options?: {
      similarity?: number;
      limit?: number;
      offset?: number;
      where?: Record<string, unknown>;
    },
  ): Promise<SearchResult<Record<string, unknown>>>;
  save(): Promise<void>;
  close(): Promise<void>;
  getInternalDb(): unknown;
}
