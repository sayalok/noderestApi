const express = require('express');

const userController = require('../controllers/user')

const router = express.Router();

router.get('/signup', userController.user_signup)
router.post('/login', userController.user_login)

module.exports = router