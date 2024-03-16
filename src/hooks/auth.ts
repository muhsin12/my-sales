// hooks/auth.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginToPos } from "../services/login-service";

interface User {
  username: string;
  role: string;
  // Add more properties as needed
}

interface AuthResponse {
  user: User;
  // Add more properties as needed
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    console.log("state user-", user);
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      const userDetails = JSON.parse(userDetailsString);
      console.log("user session--", userDetails); // This will log the parsed object
      const redirectPath = userDetails?.role === "admin" ? "admin" : "pos";
      router.push(redirectPath);
    } else {
      console.log("no user session found");
      router.push("/");
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      // Simulate logging in with credentials
      const response = await loginToPos(username, password); //  login service
      if (response?.status == 200) {
        const userData = await response?.json();
        console.log(userData);
        setUser(userData.userDetails);
        setAuthError(null);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(userData.userDetails)
        );
      } else if (response?.status == 401) {
        setUser(null);
        setAuthError("Invalid user name or Password");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    console.log("loging out in auth");
    try {
      setUser(null);
      localStorage.removeItem("userDetails");
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, login, logout, authError };
}
