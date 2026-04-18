import { signAuthToken } from "#server/lib/auth";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const authConfig = config.auth;

  if (!authConfig.enabled) {
    return {
      message: "Autenticacao desabilitada",
      authEnabled: false,
    };
  }

  const body = await readBody<{ email?: string; password?: string }>(event);

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Email e senha sao obrigatorios" });
  }

  if (body.email !== authConfig.adminEmail || body.password !== authConfig.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: "Credenciais invalidas" });
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "admin",
    email: authConfig.adminEmail,
    exp: now + authConfig.sessionTtlSeconds,
  };

  const token = signAuthToken(payload, authConfig.secret);

  setCookie(event, authConfig.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: authConfig.sessionTtlSeconds,
  });

  return {
    message: "Login realizado com sucesso",
    authEnabled: true,
  };
});
