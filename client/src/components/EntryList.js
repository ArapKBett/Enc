import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

const EntryList = () => {
  const [entries, setEntries] = useState([]);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEntries = async () => {
      const params = new URLSearchParams(location.search);
      const category = params.get('category');
      const url = category
        ? `${process.env.REACT_APP_API_URL}/entries?category=${category}`
        : `${process.env.REACT_APP_API_URL}/entries`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEntries(res.data);
    };
    fetchEntries();

    socket.on('entryUpdate', (entry) => {
      if (entry.deleted) {
        setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      } else {
        setEntries((prev) => {
          const index = prev.findIndex((e) => e._id === entry._id);
          if (index >= 0) {
            return [...prev.slice(0, index), entry, ...prev.slice(index + 1)];
          }
          return [entry, ...prev];
        });
      }
    });

    return () => socket.off('entryUpdate');
  }, [location.search, user.token]);

  return (
    <List>
      {entries.map((entry) => (
        <ListItem key={entry._id} button component={Link} to={`/entry/${entry._id}`}>
          <ListItemText primary={entry.title} secondary={entry.category.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default EntryList;
