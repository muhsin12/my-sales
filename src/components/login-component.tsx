import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  authError: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, authError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError(""); // Clear error state when both username and password are provided
    onLogin(username, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            width: "100%", // Fix the width of the form to the width of its container
            "& .MuiTextField-root": { mb: 2 },
          }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ background: "#00838f" }}
          >
            Login
          </Button>
        </Box>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        {authError && (
          <Typography sx={{ color: "red" }}>{authError}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default LoginForm;
