import {
  
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  api1: {
    from: {
      relativePath: "./api-spec-1.yaml",
      source: "file",
    },
    outputDir: "api-1",
    to: async (context) => {
      const filenamePrefix = "api1";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
  api: {
    from: {
      relativePath: "./api-spec.yaml",
      source: "file",
    },
    outputDir: "api",
    to: async (context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
