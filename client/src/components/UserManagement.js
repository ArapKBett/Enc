import React, { useState } from 'react';
import { TextField, Button, Container, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';

const UserManagement = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        { username, password, role },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('User created successfully');
      setUsername('');
      setPassword('');
      setRole('viewer');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value="admin">Admin (Writer)</MenuItem>
            <MenuItem value="animator">Animator</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create User
        </Button>
      </form>
    </Container>
  );
};

export default UserManagement;
