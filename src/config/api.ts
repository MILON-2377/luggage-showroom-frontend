export const API_CONFIG = {
  API_PREFIX: "/api/v1",

  PROXY: {
    PUBLIC: "/api/public",
    AUTH: "/api/server/auth",
    ADMIN: "/api/server/admin",
  },

  BACKEND: {
    PUBLIC: "/public",
    AUTH: "/auth",
    ADMIN: "/admin",
  },

  AUTH: {
    ACCESS_COOKIE: "access_token",
    REFRESH_COOKIE: "refresh_token",
    REFRESH_ENDPOINT: "/auth/refresh",
  },
} as const;