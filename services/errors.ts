export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function assertNoError<T>(
  error: { message: string } | null,
  fallback = "Database operation failed.",
): asserts error is null {
  if (error) {
    throw new ServiceError(error.message || fallback, error);
  }
}
