import { openApiDocument } from "#server/lib/openapi";

export default defineEventHandler(() => {
  return openApiDocument;
});
