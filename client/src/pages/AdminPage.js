import React from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import UserManagement from '../components/UserManagement';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Admin Dashboard</Typography>
      <Button onClick={() => navigate('/')} variant="outlined" color="primary" style={{ marginBottom: '20px' }}>
        Back to Home
      </Button>
      <Typography variant="h5" gutterBottom>Create Category</Typography>
      <CategoryForm onSubmit={() => window.location.reload()} />
      <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Create User</Typography>
      <UserManagement />
    </Container>
  );
};

export default AdminPage;
