const TECHNICAL_PATTERN =
  /axios|prisma|sql|stack trace|jwt|internal server|econnrefused|network error|typeerror|undefined|prismaClient|sequelize|mongo/i;

export function isTechnicalMessage(message) {
  return typeof message === "string" && TECHNICAL_PATTERN.test(message);
}

export function getFriendlyError(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (!error) return fallback;

  if (typeof error === "string") {
    const trimmed = error.trim();
    if (!trimmed || isTechnicalMessage(trimmed)) return fallback;
    return trimmed;
  }

  if (!error.response) {
    if (
      error.message === "Network Error" ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED"
    ) {
      return "Unable to connect to the server. Please try again.";
    }

    if (typeof error.message === "string" && error.message.trim() && !isTechnicalMessage(error.message)) {
      return error.message.trim();
    }

    return "Unable to connect to the server. Please try again.";
  }

  const message = error.response?.data?.message;
  if (typeof message === "string" && message.trim() && !isTechnicalMessage(message)) {
    return message.trim();
  }

  return fallback;
}

export function isNetworkError(error) {
  return Boolean(error) && !error.response;
}
