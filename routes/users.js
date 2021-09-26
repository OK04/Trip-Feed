const router = require("express").Router();
const User = require("../models/User");
const bcrypt= require('bcryptjs');

router.post("/register", async(req,res)=>{
  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    const user = await newUser.save();
    res.status(200).json(user._id);

  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/login", async(req,res)=>{
  try {
    const user = await User.findOne({username: req.body.username})
    !user && res.status(400).json("Wrong username");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong password");

    res.status(200).json({ _id: user._id , username: user.username});
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
