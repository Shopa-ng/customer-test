import { API_BASE_URL } from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody> {
  method?: HttpMethod;
  path: string;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function request<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>,
): Promise<TResponse> {
  const { method = 'GET', path, body, headers = {}, signal } = options;
  const url = `${API_BASE_URL}${path}`;
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  };
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as TResponse;
  }
  return (await res.text()) as unknown as TResponse;
}
