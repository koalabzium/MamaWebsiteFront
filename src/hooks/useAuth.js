import { useState, useCallback } from "react";

const TOKEN_KEY = "token";

// Single source of truth for "am I logged in", replacing the ad hoc
// localStorage.getItem("token") reads that used to be duplicated across
// adminPanel.jsx, books.jsx, bookDetails.jsx, BookBorrowings.jsx, etc.
// Deliberately a plain hook, not Context: nothing in this app needs a login
// on one screen to live-update a sibling screen without a remount, so a
// Context/Provider would be more machinery than the app needs.
const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return { token, isLoggedIn: !!token, login, logout };
};

export default useAuth;
