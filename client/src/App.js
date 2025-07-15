import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import EntryPage from './pages/EntryPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  return (
    <div style={{ display: 'flex' }}>
      {user && <Sidebar user={user} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />} />
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/entry/:id" element={user ? <EntryPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
