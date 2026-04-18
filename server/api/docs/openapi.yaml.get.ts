import { stringify } from "yaml";
import { openApiDocument } from "#server/lib/openapi";

export default defineEventHandler((event) => {
  setHeader(event, "content-type", "application/yaml; charset=utf-8");
  return stringify(openApiDocument);
});
