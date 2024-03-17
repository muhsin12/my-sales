const { END_POINT } = require("../config");
const loginEndPoint = END_POINT.LOGIN;

export const loginToPos = async (username: string, password: string) => {
  try {
    return fetch(loginEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Redirect or handle successful login response
  } catch (error: any) {
    console.error("Error logging in:", error.message);
  }
};
