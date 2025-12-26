import express from 'express';
import cors  from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Message } from './model/Message.js';
import { User } from './model/User.js';
import jwt from 'jsonwebtoken';
import { protect, authorize } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


//User

app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, userRole: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' , errorMessage: error.message});
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' , errorMessage: error.message});
  }
});




//message
app.post('/api/messages', async (req, res) => {
  try {
    const { username, lovername } = req.body;
    const newMessage = new Message({ username, lovername });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('/api/messages' ,  protect,
  authorize("admin"), async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
  }); 
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});