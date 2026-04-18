export default defineNuxtRouteMiddleware(async (to) => {
  const { authEnabled, ensureSession } = useAuth();
  const publicRoutes = new Set(["/login"]);

  if (!authEnabled.value) return;

  const isPublicRoute = publicRoutes.has(to.path);
  const session = await ensureSession();

  if (session.authenticated && isPublicRoute) {
    return navigateTo("/dashboard");
  }

  if (!session.authenticated && !isPublicRoute) {
    return navigateTo("/login");
  }
});
