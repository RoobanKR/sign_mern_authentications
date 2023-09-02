import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Helper function to set a cookie
const setCookie = (name, value, days) => {
  const expirationDate = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `${name}=${value}; expires=${expirationDate}; path=/`;
};

// Helper function to retrieve a cookie by name
const getCookie = (name) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

// Helper function to remove a cookie by name
const removeCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(
    getCookie("username") || null
  ); // Retrieve the username from the cookie

  const [authToken, setAuthToken] = useState(
    sessionStorage.getItem("authToken") || null
  );

  const isAuthenticated = !!authToken;
  const [sessionTimeout, setSessionTimeout] = useState(0);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3535/login", {
        email,
        password,
      });

      const fetchedUsername = response.data.username;

      // Set a cookie with the username that expires in 7 days
      setCookie("username", fetchedUsername, 7);

      const Timing = response.data.sessionTimeout;
      setSessionTimeout(Timing);

      const token = response.data.token;
      setAuthToken(token);

      setUsername(fetchedUsername); // Set username

      sessionStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Throw the error to be caught by the component
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUsername(null);

    // Remove the username cookie on logout
    removeCookie("username");

    sessionStorage.removeItem("authToken");
    localStorage.removeItem("sessionTimeout");
  };

  useEffect(() => {
    if (isAuthenticated && sessionTimeout > 0) {
      const timeout = setTimeout(() => {
        logout();
      }, sessionTimeout * 1000);
      return () => clearTimeout(timeout);
    }
  }, [authToken, isAuthenticated, sessionTimeout]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        username,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
