const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const Role = require('../models/role.model');

const authController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(400).json({ message: 'Registration error', errors });

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate)
        return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      // await new Role().save();
      // await new Role({ value: 'admin' }).save();
      const userRole = await Role.findOne({ value: 'user' });

      const user = new User({
        username,
        password: hashedPassword,
        roles: [userRole.value],
      });

      await user.save();

      return res.json({ message: 'Registration success' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user)
        return res.status(400).json({ message: `User ${username} not found` });

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword)
        return res.status(400).json({ message: 'Wrong password' });

      const token = jwt.sign(
        { id: user._id, roles: user.roles },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getInfo: async (req, res) => {
    try {
      res.send(`User roles: ${req.user.roles}`);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
