export type ApiErrorDetails = {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
};

export type ApiErrorBody = {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly cause?: unknown;

  constructor({ message, status, code, details, cause }: ApiErrorDetails) {
    super(message);

    this.name = "ApiError";
    this.status = Number.isInteger(status) && status >= 100 && status <= 599 ? status : 500;

    if (code !== undefined) {
      this.code = code;
    }

    if (details !== undefined) {
      this.details = details;
    }

    if (cause !== undefined) {
      this.cause = cause;
    }

    Object.setPrototypeOf(this, new.target.prototype);

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, new.target);
    }
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  toJSON(): ApiErrorBody {
    return {
      message: this.message,
      status: this.status,
      ...(this.code !== undefined && { code: this.code }),
      ...(this.details !== undefined && { details: this.details }),
    };
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}