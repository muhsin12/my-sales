// hooks/auth.ts

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginToPos } from "../services/login-service";
import { fetchUserSession } from "@/services/user-service";

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
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log("state user-", user);
    const userSession = fetchUserSession();
    if (userSession && firstLogin) {
      console.log("user session--", userSession); // This will log the parsed object
      const redirectPath = userSession?.role === "admin" ? "admin" : "pos";
      router.push(redirectPath);
    } else if (!userSession) {
      console.log("no user session found");
      router.push("/");
    }

    // Set timeout for automatic logout after 5 minutes of inactivity
    // const logoutTimer = setTimeout(() => {
    //   logout(); // Call the logout function after 5 minutes
    // }, 30 * 60 * 1000); // 5 minutes in milliseconds

    // Clear the timeout if the user becomes active again
    // const clearLogoutTimer = () => clearTimeout(logoutTimer);

    // Add event listeners to reset the timer on user activity
    // window.addEventListener("mousemove", clearLogoutTimer);
    // window.addEventListener("mousedown", clearLogoutTimer);
    // window.addEventListener("keypress", clearLogoutTimer);
    // window.addEventListener("touchstart", clearLogoutTimer);

    // // Cleanup event listeners on component unmount
    // return () => {
    //   window.removeEventListener("mousemove", clearLogoutTimer);
    //   window.removeEventListener("mousedown", clearLogoutTimer);
    //   window.removeEventListener("keypress", clearLogoutTimer);
    //   window.removeEventListener("touchstart", clearLogoutTimer);
    // };
  }, [user, firstLogin]);

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
        setFirstLogin(true);
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
