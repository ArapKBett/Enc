import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Container } from '@material-ui/core';
import axios from 'axios';
import socket from '../socket';
import EntryForm from './EntryForm';

const EntryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/entries/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEntry(res.data);
      } catch (err) {
        alert('Failed to load entry');
      }
    };
    fetchEntry();

    socket.on('entryUpdate', (updatedEntry) => {
      if (updatedEntry._id === id) {
        if (updatedEntry.deleted) {
          navigate('/');
        } else {
          setEntry(updatedEntry);
        }
      }
    });

    return () => socket.off('entryUpdate');
  }, [id, navigate, user.token]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/entries/upload/${id}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload file');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/entries/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete entry');
    }
  };

  if (!entry) return <Typography>Loading...</Typography>;

  return (
    <Container>
      {editMode && user.role === 'admin' ? (
        <EntryForm
          initialData={entry}
          editMode={true}
          onSubmit={() => setEditMode(false)}
        />
      ) : (
        <>
          <Typography variant="h4">{entry.title}</Typography>
          <Typography variant="subtitle1">Category: {entry.category.name}</Typography>
          <div style={{ margin: '20px 0' }}>
            {entry.subcategories.map((sub, index) => (
              <span
                key={index}
                className="bubble"
                onClick={() => sub.linkedEntry && navigate(`/entry/${sub.linkedEntry}`)}
                style={{ cursor: sub.linkedEntry ? 'pointer' : 'default' }}
              >
                {sub.name}: {sub.value}
              </span>
            ))}
          </div>
          <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          {entry.attachments.length > 0 && (
            <div>
              <Typography variant="h6">Attachments:</Typography>
              {entry.attachments.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          )}
          {user.role === 'admin' && (
            <>
              <Button onClick={() => setEditMode(true)} variant="contained" color="primary">
                Edit
              </Button>
              <Button onClick={handleDelete} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                Delete
              </Button>
            </>
          )}
          {(user.role === 'admin' || user.role === 'animator') && (
            <div style={{ marginTop: '20px' }}>
              <input type="file" onChange={handleUpload} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default EntryView;
