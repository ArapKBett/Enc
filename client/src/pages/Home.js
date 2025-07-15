import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EntryList from '../components/EntryList';
import EntryForm from '../components/EntryForm';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Encyclopedia</Typography>
      {user.role === 'admin' && (
        <>
          <Button component={Link} to="/admin" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
            Manage Categories/Users
          </Button>
          <EntryForm onSubmit={() => window.location.reload()} />
        </>
      )}
      <EntryList />
    </Container>
  );
};

export default Home;