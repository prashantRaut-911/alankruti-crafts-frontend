import {
  createContext,
  useContext,
  useMemo,
  useState
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [admin, setAdmin] = useState(() => {

    try {

      const storedAdmin =
        localStorage.getItem("alankruti_admin");

      return storedAdmin
        ? JSON.parse(storedAdmin)
        : null;

    } catch {

      return null;

    }

  });

  async function login(credentials) {

    const response =
      await authService.login(credentials);

    localStorage.setItem(
      "alankruti_token",
      response.token
    );

    localStorage.setItem(
      "alankruti_admin",
      JSON.stringify(response.admin)
    );

    setAdmin(response.admin);

    return response;
  }

  function logout() {

    localStorage.removeItem(
      "alankruti_token"
    );

    localStorage.removeItem(
      "alankruti_admin"
    );

    setAdmin(null);
  }

  const value = useMemo(
    () => ({
      admin,

      token:
        localStorage.getItem(
          "alankruti_token"
        ),

      isAdmin: Boolean(admin),

      login,

      logout
    }),
    [admin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}