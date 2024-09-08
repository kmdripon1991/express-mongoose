const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../schema/userSchema");
const User = mongoose.model("User", userSchema);

// signup
router.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // console.log(hashedPassword);
    const newUser = new User({
      username: req.body.username,
      user: req.body.user,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User successfully signup" });
  } catch (error) {
    res.status(500).json({ error: "User signup failed" });
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    console.log(user[0].password);

    if (user && user.length > 0) {
      //   console.log("true");
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          access_token: token,
          message: "Login successful",
        });
      } else {
        res.status(401).json({ error: "User Authentication failed" });
      }
    } else {
      res.status(401).json({ error: "User Authentication failed" });
    }
  } catch (error) {
    res.status(401).json({ error: "User Authentication failed" });
  }
});

// get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().populate(
      "todos",
      "title description status -_id"
    );
    res.status(200).json({ data: users, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There was an error on the server side" });
  }
});

module.exports = router;
