const express = require('express')
const { register } = require('../controllers/auth/register')
const { confirm } = require('../controllers/auth/confirm')
const { login } = require('../controllers/auth/login')
const { refresh } = require('../controllers/auth/refresh')
const router = express.Router()

// @route POST api/auth/register/
// @perms ALL
// @desc Register new account
router.post('/register', register)

// @route POST api/auth/login/
// @perms ALL
// @desc Login to account
router.post('/login', login)

// @route GET api/auth/confirm/:token
// @perms ALL
// @desc Confirm and verify account that is newly registered
router.get('/confirm/:token', confirm)

// @route GET api/auth/refresh
// @perms ALL
// @desc Refresh access token
router.get('/refresh', refresh)

module.exports = router;