
type ClientFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function clientAuthFetch(
  url: string,
  options: ClientFetchOptions = {},
): Promise<Response> {
  const cleanPath = url.replace(/^\/+/, "");

  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (options.body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const body =
    options.body === undefined
      ? undefined
      : isFormData
        ? options.body
        : JSON.stringify(options.body);

  return fetch(`/api/proxy/${cleanPath}`, {
    ...options,
    method: options.method ?? "GET",
    headers,
    body: body as BodyInit | undefined,
    credentials: "same-origin",
  });
}
