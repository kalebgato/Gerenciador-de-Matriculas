import { verifyAuthToken } from "#server/lib/auth";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const authConfig = config.auth;

  if (!authConfig.enabled) return;

  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith("/api")) return;

  const isPublicRoute =
    pathname.startsWith("/api/docs") ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/logout" ||
    pathname === "/api/auth/me";

  if (isPublicRoute) return;

  const token = getCookie(event, authConfig.cookieName);
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Nao autenticado" });
  }

  const session = verifyAuthToken(token, authConfig.secret);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Sessao invalida ou expirada" });
  }

  event.context.authUser = {
    id: session.sub,
    email: session.email,
  };
});
