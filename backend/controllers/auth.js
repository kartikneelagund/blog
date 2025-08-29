import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // validate password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    // ✅ Generate JWT Token here
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // send response without password
    const { password: pass, ...info } = user._doc;
    res.json({ ...info, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
