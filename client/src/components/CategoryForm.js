import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const CategoryForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/categories`, { name }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onSubmit();
      setName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Create Category
      </Button>
    </form>
  );
};

export default CategoryForm;