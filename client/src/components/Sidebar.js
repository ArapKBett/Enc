import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

const Sidebar = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data);
    };
    fetchCategories();

    socket.on('categoryUpdate', (category) => {
      if (category.deleted) {
        setCategories((prev) => prev.filter((c) => c._id !== category._id));
      } else {
        setCategories((prev) => {
          const index = prev.findIndex((c) => c._id === category._id);
          if (index >= 0) {
            return [...prev.slice(0, index), category, ...prev.slice(index + 1)];
          }
          return [category, ...prev];
        });
      }
    });

    return () => socket.off('categoryUpdate');
  }, [user.token]);

  useEffect(() => {
    const searchEntries = async () => {
      if (search.trim() === '') {
        setSearchResults([]);
        return;
      }
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/entries/search?q=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResults(res.data);
    };
    searchEntries();
  }, [search, user.token]);

  return (
    <div className="sidebar">
      <TextField
        label="Search Entries"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      {searchResults.length > 0 && (
        <List>
          {searchResults.map((entry) => (
            <ListItem key={entry._id} button component={Link} to={`/entry/${entry._id}`}>
              <ListItemText primary={entry.title} secondary={entry.category.name} />
            </ListItem>
          ))}
        </List>
      )}
      <List>
        {categories.map((category) => (
          <ListItem key={category._id} button component={Link} to={`/?category=${category._id}`}>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
      {user.role === 'admin' && (
        <Button component={Link} to="/admin" variant="contained" color="primary" fullWidth>
          Manage Categories/Users
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
