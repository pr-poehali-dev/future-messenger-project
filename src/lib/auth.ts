const AUTH_URL = "https://functions.poehali.dev/849024ee-8347-436a-80f7-1003c7aff105";
const TOKEN_KEY = "nc_session_token";
const USER_KEY = "nc_user";

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_emoji: string;
  level: number;
  xp: number;
  status: string;
  bio?: string;
  email?: string;
}

function getHeaders(withToken = false): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (withToken) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) h["X-Session-Token"] = token;
  }
  return h;
}

export async function register(params: {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  avatar_emoji?: string;
}): Promise<{ user: User; session_token: string }> {
  const res = await fetch(`${AUTH_URL}?action=register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  localStorage.setItem(TOKEN_KEY, data.session_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function login(params: {
  login: string;
  password: string;
}): Promise<{ user: User; session_token: string }> {
  const res = await fetch(`${AUTH_URL}?action=login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка входа");
  localStorage.setItem(TOKEN_KEY, data.session_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function getMe(): Promise<User | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const res = await fetch(`${AUTH_URL}?action=me`, {
    headers: getHeaders(true),
  });
  if (!res.ok) {
    logout();
    return null;
  }
  const data = await res.json();
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function updateProfile(params: Partial<Pick<User, "display_name" | "avatar_emoji" | "bio" | "status">>): Promise<User> {
  const res = await fetch(`${AUTH_URL}?action=profile`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка обновления");
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    fetch(`${AUTH_URL}?action=logout`, {
      method: "POST",
      headers: getHeaders(true),
    }).catch(() => {});
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
