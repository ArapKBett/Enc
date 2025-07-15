const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Matches case in models/User.js
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const categoryRoutes = require('./routes/categories');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'https://movency.onrender.com' },
});

app.use(cors({ origin: 'https://movency.onrender.com' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  // Reset admin user on startup
  const setupAdmin = async () => {
    try {
      await User.deleteOne({ username: 'admin1' }); // Remove existing user to avoid duplicates
      await User.create({ username: 'admin1', password: 'Admin123!', role: 'admin' });
      console.log('Admin user reset: admin1 with password Admin123!');
    } catch (err) {
      console.error('Error resetting admin user:', err);
    }
  };
  setupAdmin();
}).catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/categories', categoryRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));