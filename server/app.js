// Import necessary packages
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv  from 'dotenv'

dotenv.config();
const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:tRpk5fPYdxEQBOma@cluster0.crt4kpj.mongodb.net/AppDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
});

// Create a user model
const User = mongoose.model('User', userSchema);

app.use(express.json());

// Middleware to authenticate requests
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.NODE_SECRET_KEY);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

// Route to register a new user with role and token
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.NODE_SECRET_KEY, { expiresIn: '1h' });

    // Save token to the user's tokens array
    newUser.tokens = newUser.tokens.concat({ token });
    await newUser.save();

    res.json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to login with role and generate token
app.post('/login', async (req, res) => {
  console.log("req", req)
  try {
    const { username, password } = req.body;

    // Retrieve user from the database
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ _id: user._id }, process.env.NODE_SECRET_KEY, { expiresIn: '1h' });

    // Save token to the user's tokens array
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.json({ email: user.username, role: user.role, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ error: 'Internal Server Error' });
  }
});

// Protected route that requires authentication
app.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route.', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});