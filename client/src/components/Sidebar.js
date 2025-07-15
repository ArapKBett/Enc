import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Drawer variant="permanent" anchor="left">
      <Typography variant="h6" style={{ padding: '16px' }}>Categories</Typography>
      <List>
        {categories.map(category => (
          <ListItem key={category._id} component={Link} to={`/category/${category._id}`}>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;