import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @description     Get or Search all users (for chat search)
// @route           GET /api/user/search?search=
// @access          Protected
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // exclude current logged-in user
  const users = await User.find({
    ...keyword,
    _id: { $ne: req.user._id },
  }).select("-password -googleId"); // don’t expose sensitive fields

  res.json(users);
});

// @description     Debug: List all users + current user
// @route           GET /api/user/debug
// @access          Protected
const debugUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find().select("-password -googleId");
  const currentUser = await User.findById(req.user._id).select("-password -googleId");

  res.json({
    allUsers: allUsers.map(u => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      role: u.role,
    })),
    currentUser: currentUser
      ? {
          id: currentUser._id.toString(),
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        }
      : null,
  });
});

export { allUsers, debugUsers };
