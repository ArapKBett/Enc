const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs'); // Added for password hashing
const User = require('./models/User'); // Adjust path if needed
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const categoryRoutes = require('./routes/categories');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'https://movency.onrender.com' }, // Updated to match frontend
});

app.use(cors({ origin: 'https://movency.onrender.com' })); // Updated CORS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  // Create admin user on startup if not exists
  const setupAdmin = async () => {
    try {
      const exists = await User.findOne({ username: 'admin1' });
      if (!exists) {
        const hash = await bcrypt.hash('Admin123!', 10);
        await User.create({ username: 'admin1', password: hash, role: 'admin' });
        console.log('Admin user created: admin1 with password Admin123!');
      } else {
        console.log('Admin user already exists');
      }
    } catch (err) {
      console.error('Error creating admin user:', err);
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
