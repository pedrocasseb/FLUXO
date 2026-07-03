const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseErrorMessage(response: Response) {
  const data = await response.json().catch(() => null);
  const fieldMessage = data?.fields ? Object.values(data.fields)[0] : null;
  return (fieldMessage as string) ?? data?.message ?? "Não foi possível completar. Tente novamente.";
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response));
  }

  return response.json();
}

function post<T>(path: string, body: unknown) {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function authedGet<T>(path: string) {
  return request<T>(path, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export type AuthUser = { id: string; name: string; email: string; createdAt: string };

export function login(email: string, password: string) {
  return post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
}

export function register(name: string, email: string, password: string) {
  return post<{ id: string; name: string; email: string }>("/auth/register", {
    name,
    email,
    password,
  });
}

export function me() {
  return authedGet<AuthUser>("/auth/me");
}

const TOKEN_KEY = "fluxo_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
