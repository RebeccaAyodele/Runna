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
 * App endpoints consumed by the `(app)` route group:
 *
 *   GET  /tasks                    -> { tasks, nextCursor }  open tasks, proximity-sorted, paginated
 *   GET  /tasks/:id                -> { task }
 *   POST /tasks                    -> { task }
 *   POST /tasks/:id/claim          -> { task }   first-come; 409 TASK_ALREADY_CLAIMED if someone beat you
 *   POST /tasks/:id/complete       -> { task }   multipart, carries the proof photo
 *   POST /tasks/:id/confirm        -> { task }   releases the escrowed payment
 *   POST /tasks/:id/dispute        -> { task }   freezes the payout
 *   POST /ratings                  -> 201
 *   GET  /users/:id                -> { user, tasks }  public profile + rating history
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

/** How many tasks a feed page asks for. Kept here so the feed can't go unbounded. */
export const TASK_PAGE_SIZE = 10;


const TRUST_TIERS = ["new", "established", "trusted"] as const;

export type TrustTier = (typeof TRUST_TIERS)[number];

/**
 * The full status set from the TDD. The frontend never derives one of these —
 * every transition is decided server-side and read back off the response.
 */
const TASK_STATUSES = [
  "open",
  "claimed",
  "in_progress",
  "completed",
  "confirmed",
  "expired",
  "missed_deadline",
  "disputed",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

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

/** The poster/doer summary embedded in a task — not the full user record. */
export type UserSummary = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  avgRating: number | null;
  trustTier: TrustTier;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  proofRequirement: string;
  status: TaskStatus;
  /** What the poster set. */
  taskPrice: number;
  /** Calculated by the backend from the distance — the poster never edits it. */
  transportEstimate: number;
  totalPrice: number;
  locationName: string | null;
  /** Metres from the viewer; null when the backend has no location to compare. */
  distanceMeters: number | null;
  deadlineAt: string | null;
  createdAt: string;
  claimedAt: string | null;
  completedAt: string | null;
  confirmedAt: string | null;
  poster: UserSummary;
  doer: UserSummary | null;
  /** Present once proof has been uploaded. */
  proofPhotoUrl: string | null;
};

/** One page of the feed. `nextCursor` is null on the last page. */
export type TaskPage = {
  tasks: Task[];
  nextCursor: string | null;
};

export type PublicProfile = {
  user: User;
  posted: Task[];
  completed: Task[];
  ratingsCount: number;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  proofRequirement: string;
  taskPrice: number;
  locationName: string;
  deadlineAt: string | null;
};

export type TaskFeedQuery = {
  cursor?: string | null;
  search?: string;
  limit?: number;
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

async function request(path: string, init: { method: string; body?: unknown; formData?: FormData; token?: string }): Promise<unknown> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.token) headers.Authorization = `Bearer ${init.token}`;

  // `Content-Type` is deliberately left unset for multipart: the runtime has to
  // append its own boundary, and setting it by hand produces a body the backend
  // can't parse.
  const payload = init.formData ?? (init.body === undefined ? undefined : JSON.stringify(init.body));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method,
      headers,
      body: payload,
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

/* ------------------------------------------------------------------ *
 * Tasks, profiles, ratings and disputes
 * ------------------------------------------------------------------ */

function readNumber(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  // Postgres `numeric` columns come back as strings through node-postgres, so a
  // money field arriving as "500.00" is the normal case, not a contract break.
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function readIsoDate(source: Record<string, unknown>, key: string): string | null {
  const value = readString(source, key);
  if (value === null) return null;
  return Number.isNaN(new Date(value).getTime()) ? null : value;
}

function parseUserSummary(value: unknown): UserSummary {
  if (!isRecord(value)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  const id = readString(value, "id");
  const fullName = readString(value, "fullName");
  const trustTier = TRUST_TIERS.find((tier) => tier === value.trustTier);
  if (!id || !fullName || !trustTier) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  return { id, fullName, trustTier, avatarUrl: readString(value, "avatarUrl"), avgRating: readNumber(value, "avgRating") };
}

/**
 * Shape-checked like `parseUser`. A task drives money and state transitions, so
 * a malformed one should fail loudly here rather than render as a card with a
 * blank price and an unknown status.
 */
function parseTask(value: unknown): Task {
  if (!isRecord(value)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });

  const id = readString(value, "id");
  const title = readString(value, "title");
  const proofRequirement = readString(value, "proofRequirement");
  const status = TASK_STATUSES.find((candidate) => candidate === value.status);
  const taskPrice = readNumber(value, "taskPrice");
  const transportEstimate = readNumber(value, "transportEstimate");
  const createdAt = readIsoDate(value, "createdAt");

  if (!id || !title || !proofRequirement || !status || taskPrice === null || transportEstimate === null || !createdAt) {
    throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  }

  return {
    id,
    title,
    description: readString(value, "description") ?? "",
    proofRequirement,
    status,
    taskPrice,
    transportEstimate,
    totalPrice: readNumber(value, "totalPrice") ?? taskPrice + transportEstimate,
    locationName: readString(value, "locationName"),
    distanceMeters: readNumber(value, "distanceMeters"),
    deadlineAt: readIsoDate(value, "deadlineAt"),
    createdAt,
    claimedAt: readIsoDate(value, "claimedAt"),
    completedAt: readIsoDate(value, "completedAt"),
    confirmedAt: readIsoDate(value, "confirmedAt"),
    poster: parseUserSummary(value.poster),
    doer: value.doer == null ? null : parseUserSummary(value.doer),
    proofPhotoUrl: readString(value, "proofPhotoUrl"),
  };
}

/** Unwraps `{ task }` or a bare task object — both shapes are in the wild. */
function parseTaskEnvelope(value: unknown): Task {
  if (isRecord(value) && isRecord(value.task)) return parseTask(value.task);
  return parseTask(value);
}

function parseTaskList(value: unknown): Task[] {
  return Array.isArray(value) ? value.map(parseTask) : [];
}

function parseTaskPage(value: unknown): TaskPage {
  if (Array.isArray(value)) return { tasks: parseTaskList(value), nextCursor: null };
  if (!isRecord(value)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  return { tasks: parseTaskList(value.tasks ?? value.data), nextCursor: readString(value, "nextCursor") };
}

/**
 * The feed is always paginated — `limit` is sent on every call so an unbounded
 * list can't come back even if the backend's own default changes.
 */
export async function listTasks(token: string, query: TaskFeedQuery = {}): Promise<TaskPage> {
  const params = new URLSearchParams({ limit: String(query.limit ?? TASK_PAGE_SIZE) });
  if (query.cursor) params.set("cursor", query.cursor);
  if (query.search) params.set("search", query.search);
  return parseTaskPage(await request(`/tasks?${params.toString()}`, { method: "GET", token }));
}

export async function getTask(token: string, taskId: string): Promise<Task> {
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}`, { method: "GET", token }));
}

export async function createTask(token: string, input: CreateTaskInput): Promise<Task> {
  return parseTaskEnvelope(await request("/tasks", { method: "POST", body: input, token }));
}

export async function claimTask(token: string, taskId: string): Promise<Task> {
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}/claim`, { method: "POST", token }));
}

export async function startTask(token: string, taskId: string): Promise<Task> {
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}/start`, { method: "POST", token }));
}

/**
 * Completion carries the proof photo, so this one goes out as multipart rather
 * than JSON. The file never touches the frontend's own storage — it's forwarded
 * to the backend, which owns the Cloudinary credentials.
 */
export async function completeTask(token: string, taskId: string, photo: File): Promise<Task> {
  const form = new FormData();
  form.append("photo", photo);
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}/complete`, { method: "POST", formData: form, token }));
}

export async function confirmTask(token: string, taskId: string): Promise<Task> {
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}/confirm`, { method: "POST", token }));
}

export async function disputeTask(token: string, taskId: string, reason: string): Promise<Task> {
  return parseTaskEnvelope(await request(`/tasks/${encodeURIComponent(taskId)}/dispute`, { method: "POST", body: { reason }, token }));
}

export async function rateTask(token: string, input: { taskId: string; score: number; comment: string | null }): Promise<void> {
  await request("/ratings", { method: "POST", body: input, token });
}

export async function getPublicProfile(token: string, userId: string): Promise<PublicProfile> {
  const body = await request(`/users/${encodeURIComponent(userId)}`, { method: "GET", token });
  if (!isRecord(body)) throw new ApiError("Unexpected response from Runna. Try again.", { status: 502 });
  return {
    user: parseUser(body.user ?? body),
    posted: parseTaskList(body.posted),
    completed: parseTaskList(body.completed),
    ratingsCount: readNumber(body, "ratingsCount") ?? 0,
  };
}
