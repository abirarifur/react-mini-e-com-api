const router = require("express").Router();
const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SEC
    ).toString(),
  });
  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong Credentials");

    const hashPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    );

    const pass = hashPass.toString(CryptoJS.enc.Utf8);
    pass !== req.body.password && res.status(401).json("Wrong Credentials");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...rest } = user._doc;

    res.status(200).json({ ...rest, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
