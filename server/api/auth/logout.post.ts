export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  setCookie(event, config.auth.cookieName, "", {
    path: "/",
    maxAge: 0,
  });

  return {
    message: "Logout realizado com sucesso",
  };
});
