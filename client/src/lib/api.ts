const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const fieldMessage = data?.fields ? Object.values(data.fields)[0] : null;
    throw new ApiError((fieldMessage as string) ?? data?.message ?? "Não foi possível completar. Tente novamente.");
  }

  return response.json();
}

export function login(email: string, password: string) {
  return request<{ token: string }>("/auth/login", { email, password });
}

export function register(name: string, email: string, password: string) {
  return request<{ id: string; name: string; email: string }>("/auth/register", {
    name,
    email,
    password,
  });
}

const TOKEN_KEY = "fluxo_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
