import { verifyAuthToken } from "#server/lib/auth";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const authConfig = config.auth;

  if (!authConfig.enabled) {
    return {
      authenticated: true,
      authEnabled: false,
      user: {
        id: "auth-disabled",
        email: "auth-disabled@local",
      },
    };
  }

  const token = getCookie(event, authConfig.cookieName);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Nao autenticado" });
  }

  const payload = verifyAuthToken(token, authConfig.secret);
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: "Sessao invalida ou expirada" });
  }

  return {
    authenticated: true,
    authEnabled: true,
    user: {
      id: payload.sub,
      email: payload.email,
    },
  };
});
