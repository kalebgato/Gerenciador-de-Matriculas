export const useAuth = () => {
  const config = useRuntimeConfig();
  const authEnabled = computed(() => config.public.authEnabled as boolean);
  const session = useState<{
    checked: boolean;
    authenticated: boolean;
    user: { id: string; email: string } | null;
  }>("auth-session", () => ({
    checked: false,
    authenticated: false,
    user: null,
  }));

  const setAnonymous = () => {
    session.value = {
      checked: true,
      authenticated: false,
      user: null,
    };
  };

  const login = async (email: string, password: string) => {
    const result = await $fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: { email, password },
    });

    await ensureSession(true);
    return result;
  };

  const logout = async () => {
    const result = await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setAnonymous();
    return result;
  };

  const me = async () => {
    const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;
    const result = await $fetch<{
      authenticated: boolean;
      user: { id: string; email: string };
    }>("/api/auth/me", {
      credentials: "include",
      headers,
    });

    session.value = {
      checked: true,
      authenticated: result.authenticated,
      user: result.user,
    };

    return result;
  };

  const ensureSession = async (force = false) => {
    if (!authEnabled.value) {
      session.value = {
        checked: true,
        authenticated: true,
        user: { id: "auth-disabled", email: "auth-disabled@local" },
      };
      return session.value;
    }

    if (!force && session.value.checked) {
      return session.value;
    }

    try {
      await me();
    } catch {
      setAnonymous();
    }

    return session.value;
  };

  return {
    authEnabled,
    session,
    login,
    logout,
    me,
    ensureSession,
  };
};
