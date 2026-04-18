export default defineNuxtRouteMiddleware(async (to) => {
  const { authEnabled } = useAuth();
  const publicRoutes = new Set(["/login"]);

  if (!authEnabled.value) return;

  const isPublicRoute = publicRoutes.has(to.path);

  if (import.meta.server) {
    // SSR: lê o cookie diretamente para evitar chamada HTTP interna ao Nitro.
    // $fetch em route middlewares durante SSR cria um deadlock de IPC no modo dev.
    // A validação completa do token já é feita pelo server/middleware/auth.ts.
    const authCookie = useCookie("gm_auth_token");
    const authenticated = !!authCookie.value;

    if (authenticated && isPublicRoute) return navigateTo("/dashboard");
    if (!authenticated && !isPublicRoute) return navigateTo("/login");
    return;
  }

  // Client-side: usa o fluxo completo com /api/auth/me
  const { ensureSession } = useAuth();
  const session = await ensureSession();

  if (session.authenticated && isPublicRoute) return navigateTo("/dashboard");
  if (!session.authenticated && !isPublicRoute) return navigateTo("/login");
});
