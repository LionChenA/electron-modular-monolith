import { router } from '../src/app/main/router';
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import * as fs from 'node:fs';
import * as path from 'node:path';

(async () => {
  // Load the AppRouter
  const appRouter = router;

  // Create generator with schema converters
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  });

  // Generate OpenAPI spec
  const openApiSpec = await generator.generate(appRouter, {
    info: {
      title: 'Electron Modular Monolith oRPC API',
      version: '1.0.0',
    },
  });

  // Post-process: Add tags based on operationId prefix
  // operationId format: "namespace.procedureName" (e.g., "general.getVersions")
  // This fixes the "undefinedController" issue in Kubb-generated files
  const spec = openApiSpec as { paths?: Record<string, Record<string, { operationId?: string; tags?: string[] }>> };
  if (spec.paths) {
    for (const pathKey of Object.keys(spec.paths)) {
      const pathItem = spec.paths[pathKey];
      for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
        const operation = pathItem[method];
        if (operation?.operationId) {
          const tag = operation.operationId.split('.')[0];
          operation.tags = [tag];
        }
      }
    }
  }

  // Define output path
  const outputPath = path.resolve(process.cwd(), 'test/mocks/openapi.json');
  const outputDir = path.dirname(outputPath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the OpenAPI spec to a file
  fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));

  console.log(`OpenAPI spec generated to ${outputPath}`);
})();
