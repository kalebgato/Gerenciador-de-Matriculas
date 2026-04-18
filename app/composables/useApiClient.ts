type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

export const useApiClient = () => {
  const request = async <T>(path: string, options: RequestOptions = {}) => {
    const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;

    return $fetch<T>(path, {
      method: options.method,
      query: options.query,
      body: options.body,
      credentials: "include",
      headers,
    } as any);
  };

  return {
    get: <T>(path: string, query?: RequestOptions["query"]) =>
      request<T>(path, { method: "GET", query }),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "POST", body }),
    put: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "PUT", body }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "PATCH", body }),
    delete: <T>(path: string) =>
      request<T>(path, { method: "DELETE" }),
  };
};
