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

  if (response.status === 204) {
    return undefined as T;
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

function authedSend<T>(method: "POST" | "PUT" | "DELETE", path: string, body?: unknown) {
  return request<T>(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
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

export type CategoryType = "INCOME" | "EXPENSE" | "INVESTMENT";

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
};

export function listCategories() {
  return authedGet<Category[]>("/api/categories");
}

export function createCategory(name: string, type: CategoryType) {
  return authedSend<Category>("POST", "/api/categories", { name, type });
}

export function updateCategory(id: string, name: string, type: CategoryType) {
  return authedSend<Category>("PUT", `/api/categories/${id}`, { name, type });
}

export function deleteCategory(id: string) {
  return authedSend<void>("DELETE", `/api/categories/${id}`);
}

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  categoryId: string;
  categoryName: string;
};

export type TransactionInput = {
  description: string;
  amount: number;
  transactionDate: string;
  categoryId?: string;
  type: CategoryType;
};

export function listTransactions() {
  return authedGet<Transaction[]>("/api/transactions");
}

export function createTransaction(input: TransactionInput) {
  return authedSend<Transaction>("POST", "/api/transactions", input);
}

export function updateTransaction(id: string, input: TransactionInput) {
  return authedSend<Transaction>("PUT", `/api/transactions/${id}`, input);
}

export function deleteTransaction(id: string) {
  return authedSend<void>("DELETE", `/api/transactions/${id}`);
}

export type ComparisonDetail = {
  current: number;
  previous: number;
  difference: number;
  percentage: number;
};

export type DashboardData = {
  summary: {
    balance: number;
    income: number;
    expense: number;
    investment: number;
    saving: number;
  };
  comparisons: {
    income: ComparisonDetail;
    expense: ComparisonDetail;
    investment: ComparisonDetail;
    saving: ComparisonDetail;
  };
  insights: string[];
  expensesByCategory: { category: string; amount: number; percentage: number }[];
  monthlyEvolution: {
    month: string;
    income: number;
    expense: number;
    investment: number;
    saving: number;
  }[];
  projections: { projectedExpense: number; projectedInvestment: number };
};

export function getDashboard() {
  return authedGet<DashboardData>("/api/dashboard");
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
