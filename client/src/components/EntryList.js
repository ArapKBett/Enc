import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const EntryList = () => {
  const { categoryId } = useParams();
  const [entries, setEntries] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);
    socket.on('entryUpdate', () => {
      fetchEntries();
    });

    fetchEntries();
    return () => socket.disconnect();
  }, [categoryId]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/entries${categoryId ? `?categoryId=${categoryId}` : ''}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Entries</Typography>
      <List>
        {entries.map(entry => (
          <ListItem key={entry._id} component={Link} to={`/entry/${entry._id}`}>
            <ListItemText primary={entry.title} secondary={entry.category.name} />
            {user?.role === 'admin' && (
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(entry._id)}>
                Delete
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </>
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/entries/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };
};

export default EntryList;