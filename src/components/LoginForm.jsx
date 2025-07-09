import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Paper, Typography, Box, TextField, Button } from '@mui/material';

function LoginForm({ onLogin, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'tobi' && password === 'tobi') {
      onLogin();
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Login Kasir TOBI</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} autoFocus fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
          {error && <Typography color="error" align="center">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Login</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginForm;
