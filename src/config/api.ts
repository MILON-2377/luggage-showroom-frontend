
export const API_CONFIG = {
  API_PREFIX: "/api/v1",

  PROXY: {
    PUBLIC: "/api/public",
    ADMIN: "/api/server/admin",
  },

  BACKEND: {
    PUBLIC: "/public",
    ADMIN: "/admin",
  },

  AUTH: {
    ACCESS_COOKIE: "__Host-access_token",
    REFRESH_COOKIE: "__Host-refresh_token",
    REFRESH_ENDPOINT: "/auth/refresh",
  },
} as const;
