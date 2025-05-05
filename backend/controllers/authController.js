const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User (tanpa password, tanpa upload image)
exports.registerUser = async (req, res) => {
  const { name, username, preferred_timezone } = req.body;

  // Validasi field wajib
  if (!name || !username || !preferred_timezone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Cek username sudah ada?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Buat user
    const user = await User.create({
      name,
      username,
      preferred_timezone,
    });

    // Response tanpa password
    res.status(201).json({
      id: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        preferred_timezone: user.preferred_timezone,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login User hanya dengan username
exports.loginUser = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user.id,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        preferred_timezone: user.preferred_timezone,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    // req.user.id diassign oleh middleware protect dari JWT payload
    const user = await User.findOne({ id: req.user.id }).select(
      "-_id -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user info", error: err.message });
  }
};