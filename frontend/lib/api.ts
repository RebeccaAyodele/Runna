/**
 * The only place in the frontend that talks to the Express backend.
 * Components and pages never call `fetch` directly — they go through a Server
 * Action, and the action calls one of the functions below.
 *
 * Auth endpoints consumed by the onboarding flow (see `/.docs` TDD § API):
 *
 *   POST /auth/signup              -> { user }         creates the account, emails a 6-digit code
 *   POST /auth/login               -> { user, token }  403 + code EMAIL_NOT_VERIFIED while unverified
 *   POST /auth/verify-email        -> { user, token }  consumes the code, account becomes usable
 *   POST /auth/resend-verification -> 204              re-sends the code
 *   POST /auth/forgot-password     -> 204              emails a reset link
 *
 * The backend returns the JWT in the JSON body rather than relying on its own
 * `Set-Cookie`: the API lives on a different origin to the frontend, so a
 * cookie it sets is a third-party cookie and gets dropped by default in most
 * browsers. Instead the Server Action reads `token` here and writes it as an
 * httpOnly cookie on the frontend's own origin (see `lib/session.ts`), which
 * keeps the token out of client-accessible JavaScript either way.
 *
 * Errors are expected as `{ error: { message, code?, fields? } }`; anything
 * that doesn't parse falls back to a status-appropriate message.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const REQUEST_TIMEOUT_MS = 15_000;

const TRUST_TIERS = ["new", "established", "trusted"] as const;

export type TrustTier = (typeof TRUST_TIERS)[number];

export type User = {
  id: string;
  fullName: string;
  matricNumber: string;
  schoolEmail: string;
  avgRating: number | null;
  trustTier: TrustTier;
};

export type AuthResult = {
  user: User;
  token: string;
};

export type SignUpInput = {
  fullName: string;
  matricNumber: string;
  schoolEmail: string;
  password: string;
};

export type SignInInput = {
  schoolEmail: string;
  password: string;
};

export type VerifyEmailInput = {
  schoolEmail: string;
  code: string;
};

/** Thrown for every non-2xx response and for transport failures (status 0). */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  /** Per-field messages keyed by form field name, when the backend sends them. */
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, options: { status: number; code?: string | null; fieldErrors?: Record<string, string> }) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code ?? null;
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function defaultMessageFor(status: number): string {
  if (status === 0) return "We couldn't reach Runna. Check your connection and try again.";
  if (status === 401) return "Those details don't match an account. Check them and try again.";
  if (status === 409) return "An account with those details already exists.";
  if (status === 429) return "Too many attempts. Wait a moment before trying again.";
  if (status >= 500) return "Runna is having a moment. Try again shortly.";
  return "Something went wrong. Try again.";
}

function parseFieldErrors(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  const fieldErrors: Record<string, string> = {};
  for (const [field, message] of Object.entries(value)) {
    if (typeof message === "string") fieldErrors[field] = message;
    else if (Array.isArray(message) && typeof message[0] === "string") fieldErrors[field] = message[0];
  }
  return fieldErrors;
}

function toApiError(status: number, body: unknown): ApiError {
  const envelope = isRecord(body) ? body : {};
  const payload = isRecord(envelope.error) ? envelope.error : envelope;
  const message = readString(payload, "message") ?? defaultMessageFor(status);
  const code = readString(payload, "code");
  const fieldErrors = parseFieldErrors(payload.fields ?? payload.fieldErrors ?? payload.errors);
  return new ApiError(message, { status, code, fieldErrors });
}

/**
 * The backend is the source of truth for the user record, so we check the shape
 * rather than casting — a contract mismatch surfaces as a clean error message
 * instead of an undefined read somewhere deep in a screen.
 */
function parseUser(value: unknown): User {
  if (!isRecord(value)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  const id = readString(value, "id");
  const fullName = readString(value, "fullName");
  const matricNumber = readString(value, "matricNumber");
  const schoolEmail = readString(value, "schoolEmail");
  const trustTier = TRUST_TIERS.find((tier) => tier === value.trustTier);
  if (!id || !fullName || !matricNumber || !schoolEmail || !trustTier) {
    throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  }
  return { id, fullName, matricNumber, schoolEmail, trustTier, avgRating: typeof value.avgRating === "number" ? value.avgRating : null };
}

function parseAuthResult(value: unknown): AuthResult {
  if (!isRecord(value)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  const token = readString(value, "token");
  if (!token) throw new ApiError("Runna didn't return a session. Try again.", { status: 502 });
  return { token, user: parseUser(value.user) };
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (text.length === 0) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function request(path: string, init: { method: string; body?: unknown; token?: string }): Promise<unknown> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError(defaultMessageFor(0), { status: 0, code: "NETWORK_ERROR" });
  }

  const body = await readBody(response);
  if (!response.ok) throw toApiError(response.status, body);
  return body;
}

export async function signUp(input: SignUpInput): Promise<void> {
  await request("/auth/signup", { method: "POST", body: input });
}

export async function signIn(input: SignInInput): Promise<AuthResult> {
  return parseAuthResult(await request("/auth/login", { method: "POST", body: input }));
}

export async function verifyEmail(input: VerifyEmailInput): Promise<AuthResult> {
  return parseAuthResult(await request("/auth/verify-email", { method: "POST", body: input }));
}

export async function resendVerification(schoolEmail: string): Promise<void> {
  await request("/auth/resend-verification", { method: "POST", body: { schoolEmail } });
}

export async function requestPasswordReset(schoolEmail: string): Promise<void> {
  await request("/auth/forgot-password", { method: "POST", body: { schoolEmail } });
}

export async function getCurrentUser(token: string): Promise<User> {
  return parseUser(await request("/auth/me", { method: "GET", token }));
}
