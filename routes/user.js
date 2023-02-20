const router = require('express').Router()
const { get } = require('../controllers/user/get')

// @route GET /api/user/
// @perms Admin only
// @desc Retrieve users
router.get('/', get)

module.exports = router;