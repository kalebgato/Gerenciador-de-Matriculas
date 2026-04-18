import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { stringify } from "yaml";
import { openApiDocument } from "../server/lib/openapi";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

type OpenApiSchema = {
  $ref?: string;
  oneOf?: OpenApiSchema[];
  allOf?: OpenApiSchema[];
  type?: string;
  format?: string;
  enum?: Array<string | number | boolean>;
  properties?: Record<string, OpenApiSchema>;
  items?: OpenApiSchema;
};

type OpenApiOperation = {
  summary?: string;
  tags?: string[];
  parameters?: Array<{
    $ref?: string;
    name?: string;
    in?: "query" | "path" | "header" | "cookie";
    schema?: OpenApiSchema;
  }>;
  requestBody?: {
    content?: {
      "application/json"?: {
        schema?: OpenApiSchema;
      };
    };
  };
};

const METHOD_ORDER: HttpMethod[] = ["get", "post", "put", "delete", "patch"];
const COLLECTION_ROOT = path.resolve(process.cwd(), "Gestão de Matriculas");
const BASE_URL = "http://localhost:3000";

const resolveRef = (schema: OpenApiSchema, components: any): OpenApiSchema => {
  if (!schema.$ref) return schema;
  const refName = schema.$ref.replace("#/components/schemas/", "");
  return (components.schemas?.[refName] ?? {}) as OpenApiSchema;
};

const resolveParameter = (param: any, components: any) => {
  if (!param.$ref) return param;
  const refName = String(param.$ref).replace("#/components/parameters/", "");
  return components.parameters?.[refName] ?? param;
};

const sampleByType = (schema: OpenApiSchema): unknown => {
  if (schema.enum?.length) return schema.enum[0];

  if (schema.oneOf?.length) return sampleByType(schema.oneOf[0]);
  if (schema.allOf?.length) {
    const merged = schema.allOf.reduce((acc, part) => {
      const sample = sampleByType(part);
      if (sample && typeof sample === "object" && !Array.isArray(sample)) {
        return { ...acc, ...sample };
      }
      return acc;
    }, {} as Record<string, unknown>);
    return merged;
  }

  if (schema.type === "object" || schema.properties) {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(schema.properties ?? {})) {
      output[key] = sampleByType(value);
    }
    return output;
  }

  if (schema.type === "array") {
    return [sampleByType(schema.items ?? { type: "string" })];
  }

  if (schema.format === "uuid") return "00000000-0000-0000-0000-000000000000";
  if (schema.format === "date-time") return "2026-01-01T00:00:00.000Z";

  switch (schema.type) {
    case "integer":
      return 1;
    case "number":
      return 10;
    case "boolean":
      return true;
    case "string":
    default:
      return "string";
  }
};

const toSampleBody = (schema: OpenApiSchema | undefined, components: any): unknown => {
  if (!schema) return {};
  const resolved = resolveRef(schema, components);
  return sampleByType(resolved);
};

const sanitizeFileName = (name: string): string =>
  name
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toRequestName = (method: HttpMethod, route: string, summary?: string) => {
  if (summary) return summary;

  const hasId = route.includes("{id}");
  if (route.endsWith("/student/{id}")) return "Get By Student Id";

  if (method === "get" && !hasId) return "Get All";
  if (method === "get" && hasId) return "Get by Id";
  if (method === "post") return "Create";
  if (method === "put") return "Update by Id";
  if (method === "delete") return "Delete by Id";
  return `${method.toUpperCase()} ${route}`;
};

const ensureFolder = async (folderPath: string) => {
  await mkdir(folderPath, { recursive: true });
};

const writeYamlFile = async (filePath: string, data: unknown) => {
  const yaml = stringify(data);
  await writeFile(filePath, yaml, "utf-8");
};

const main = async () => {
  const doc = openApiDocument as any;
  const components = doc.components ?? {};

  await ensureFolder(COLLECTION_ROOT);

  await writeYamlFile(path.join(COLLECTION_ROOT, "opencollection.yml"), {
    opencollection: "1.0.0",
    info: {
      name: doc.info?.title ?? "API Collection",
    },
    config: {
      proxy: {
        inherit: true,
        config: {
          protocol: "http",
          hostname: "",
          port: "",
          auth: {
            username: "",
            password: "",
          },
          bypassProxy: "",
        },
      },
    },
    bundled: false,
    extensions: {
      bruno: {
        ignore: ["node_modules", ".git"],
        presets: {
          request: {
            type: "http",
            url: `${BASE_URL}/api`,
          },
        },
      },
    },
  });

  const grouped = new Map<string, Array<{ route: string; method: HttpMethod; operation: OpenApiOperation }>>();

  for (const [route, ops] of Object.entries(doc.paths ?? {})) {
    for (const method of METHOD_ORDER) {
      const operation = (ops as any)[method] as OpenApiOperation | undefined;
      if (!operation) continue;

      const folder = operation.tags?.[0] ?? "Misc";
      if (!grouped.has(folder)) grouped.set(folder, []);
      grouped.get(folder)!.push({ route, method, operation });
    }
  }

  let folderSeq = 1;
  let requestSeq = 1;

  for (const [folderName, entries] of grouped) {
    const folderPath = path.join(COLLECTION_ROOT, folderName);
    await ensureFolder(folderPath);

    await writeYamlFile(path.join(folderPath, "folder.yml"), {
      info: {
        name: folderName,
        type: "folder",
        seq: folderSeq++,
      },
      request: {
        auth: "inherit",
      },
    });

    const usedNames = new Set<string>();

    for (const { route, method, operation } of entries) {
      const nameBase = sanitizeFileName(toRequestName(method, route, operation.summary));
      let name = nameBase;
      let suffix = 2;
      while (usedNames.has(name)) {
        name = `${nameBase} ${suffix++}`;
      }
      usedNames.add(name);

      const pathParams = (operation.parameters ?? [])
        .map((p) => resolveParameter(p, components))
        .filter((p) => p.in === "path");

      const queryParams = (operation.parameters ?? [])
        .map((p) => resolveParameter(p, components))
        .filter((p) => p.in === "query");

      let urlPath = route;
      for (const p of pathParams) {
        urlPath = urlPath.replace(`{${p.name}}`, String(sampleByType(p.schema ?? { type: "string" })));
      }

      const query = queryParams
        .map((p) => `${p.name}=${encodeURIComponent(String(sampleByType(p.schema ?? { type: "string" })))}`)
        .join("&");

      const fullUrl = `${BASE_URL}${urlPath}${query ? `?${query}` : ""}`;

      const requestBodySchema = operation.requestBody?.content?.["application/json"]?.schema;
      const sampleBody = toSampleBody(requestBodySchema, components);

      const output: Record<string, unknown> = {
        info: {
          name,
          type: "http",
          seq: requestSeq++,
        },
        http: {
          method: method.toUpperCase(),
          url: fullUrl,
          auth: "inherit",
        },
        settings: {
          encodeUrl: true,
          timeout: 0,
          followRedirects: true,
          maxRedirects: 5,
        },
      };

      if (requestBodySchema) {
        (output.http as Record<string, unknown>).body = {
          type: "json",
          data: JSON.stringify(sampleBody, null, 2),
        };
      }

      await writeYamlFile(path.join(folderPath, `${name}.yml`), output);
    }
  }

  console.log("OpenCollection sincronizada com OpenAPI em:", COLLECTION_ROOT);
};

main().catch((error) => {
  console.error("Falha ao sincronizar OpenCollection:", error);
  process.exit(1);
});
