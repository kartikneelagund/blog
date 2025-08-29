import User from "../models/User.js";

// Get logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Get all NON-ADMIN users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Only return users where isAdmin is false
    const users = await User.find({ isAdmin: false }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Update user (but not admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json("User not found");
    if (user.isAdmin) return res.status(403).json("You cannot edit an admin");

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Delete user (but not admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json("User not found");
    if (user.isAdmin) return res.status(403).json("You cannot delete an admin");

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
