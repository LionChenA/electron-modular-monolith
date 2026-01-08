/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* RULES: CIRCULAR DEPENDENCIES */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'This dependency is part of a circular relationship.',
      from: {},
      to: { circular: true },
    },

    /* RULES: ARCHITECTURE LAYERS */
    {
      name: 'no-shared-to-upper',
      severity: 'error',
      comment: 'Shared layer is the kernel and MUST NOT depend on Features or App layers.',
      from: { path: '^src/shared' },
      to: { path: '^src/(features|app)' },
    },
    {
      name: 'no-features-to-app',
      severity: 'error',
      comment: 'Features MUST NOT depend on the App layer (Infrastructure). Use Dependency Injection.',
      from: { path: '^src/features' },
      to: { path: '^src/app' },
    },
    {
      name: 'no-src-to-test',
      severity: 'error',
      comment: 'Source code MUST NOT depend on test code.',
      from: { path: '^src' },
      to: { path: '^test' },
    },

    /* RULES: ELECTRON SECURITY / ISOLATION */
    {
      name: 'no-renderer-to-node',
      severity: 'error',
      comment: 'Renderer process code MUST NOT import Node.js built-ins or Electron Main modules.',
      from: { path: '^src/app/renderer|^src/features/.*/renderer' },
      to: {
        dependencyTypes: ['core'], // Node.js built-ins like fs, path
        path: ['^electron$'], // But 'electron' package usage depends on if it's type-only or runtime
      },
    },
    
    /* RULES: FEATURE ENCAPSULATION */
    {
      name: 'feature-encapsulation',
      severity: 'warn', // Start as warning
      comment: 'A feature should not reach deep into another feature implementation details.',
      from: { path: '^src/features/([^/]+)' },
      to: {
        path: '^src/features/([^/]+)',
        pathNot: [
          '^src/features/$1', // Self is allowed
          '^src/features/[^/]+/shared', // Public contract is allowed
          '^src/features/[^/]+/index.ts' // Public entry is allowed
        ]
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true, // Use TS pre-compilation to handle path aliases correctly
    tsConfig: {
      fileName: './tsconfig.web.json', // Use web config as base, it usually covers most
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
