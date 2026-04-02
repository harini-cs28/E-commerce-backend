const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/authMiddleware");
const multer = require("multer");

/* MULTER CONFIG */

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= GET PROFILE ================= */

router.get("/", auth, async (req, res) => {
  try {

    const user = await User
      .findById(req.user.id)
      .select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= UPDATE BASIC PROFILE ================= */

router.put("/", auth, async (req, res) => {

  try {

    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= ADD ADDRESS ================= */

router.post("/address", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.addresses.push(req.body);

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= DELETE ADDRESS ================= */

router.delete("/address/:id", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= SET DEFAULT ADDRESS ================= */

router.put("/address/default/:id", auth, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


/* ================= UPLOAD AVATAR ================= */

router.put("/avatar", auth, upload.single("avatar"), async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const base64 = req.file.buffer.toString("base64");

    const avatar = `data:${req.file.mimetype};base64,${base64}`;

    user.avatar = avatar;

    await user.save();

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


module.exports = router;