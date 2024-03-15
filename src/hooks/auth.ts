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
    // const checkAuth = async () => {
    //   try {
    //     // Simulate fetching user data from an API
    //     const response: AuthResponse = await fetchUserData(); // Fetch user data from an API
    //     setUser(response.user);
    //   } catch (error) {
    //     console.error("Authentication error:", error);
    //     setUser(null);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // checkAuth();
    console.log("state user-", user);
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      // Simulate logging in with credentials
      const response = await loginToPos(username, password); // Fake login function
      if (response?.status == 200) {
        const userData = await response?.json();
        console.log(userData);
        setUser(userData.userDetails);

        // router.push("/pos");
        setAuthError(null);
      } else if (response?.status == 401) {
        setUser(null);
        setAuthError("Invalid user name or Password");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      // Simulate logging out
      await fakeLogout(); // Fake logout function
      setUser(null);
      router.push("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, loading, login, logout, authError };
}

// Example functions for simulating authentication actions (replace with actual API calls in your application)

// async function fetchUserData(): Promise<AuthResponse> {
//   // Simulate fetching user data from an API
//   return new Promise<AuthResponse>((resolve) => {
//     setTimeout(() => {
//       resolve({
//         user: { id: 1, name: "John Doe" }, // Sample user data
//       });
//     }, 1000); // Simulate delay
//   });
// }

async function fakeLogout(): Promise<void> {
  // Simulate logout
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("Logged out");
      resolve();
    }, 1000); // Simulate delay
  });
}
