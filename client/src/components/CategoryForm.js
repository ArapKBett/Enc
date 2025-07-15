import React, { useState } from 'react';
import { TextField, Button, Container } from '@material-ui/core';
import axios from 'axios';

const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/categories`,
        { name },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onSubmit(res.data);
      setName('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Category
        </Button>
      </form>
    </Container>
  );
};

export default CategoryForm;
