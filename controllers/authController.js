const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {

    console.log("Incoming request:", req.body);

    const { email, password } = req.body;

    /* Validate request */

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    /* Find user */

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    console.log("User found:", user.email);

    /* Compare password */

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    /* Generate JWT */

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    /* Send response */

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login",
      error: error.message
    });

  }
};


/* ================= REGISTER ================= */

const register = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (err) {

    console.error("Register error:", err);

    res.status(500).json({
      message: err.message
    });

  }
};

module.exports = { login, register };