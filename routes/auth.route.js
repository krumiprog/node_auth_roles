const router = require('express').Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const authController = require('../controllers/auth.controller');

const roles = ['admin'];
const checks = [
  check('username', 'Username can not be empty').notEmpty(),
  check('password', 'Password must be at least 6 characters long').isLength({
    min: 6,
  }),
];

router.post('/register', checks, authController.register);
router.post('/login', authController.login);
router.get('/users', roleMiddleware(roles), authController.getUsers);
router.get('/info', authMiddleware, authController.getInfo);

module.exports = router;
