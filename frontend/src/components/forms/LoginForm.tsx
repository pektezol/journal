import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api_login } from '../../api/api';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await api_login(username, password);
      localStorage.setItem("token", token);
      alert("Login success!")
      navigate("/");
    } catch (error) {
      alert("Error during login, check console logs.")
      console.error("error during login:", error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} textAlign="center">
        <TextField
          label="Username"
          variant="outlined"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleLogin();
            }
          }}
          required
        />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleLogin();
            }
          }}
          required
        />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Button variant="contained" color="primary" type="button" onClick={handleLogin}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
