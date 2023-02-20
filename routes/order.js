const { get } = require('../controllers/order/get');
const { pay } = require('../controllers/order/pay')

const router = require('express').Router()

// @route POST /api/product/
// @perms All users
// @desc Create new order and pay
router.post('/pay', pay)

// @route GET /api/product?userId=''
// @perms All users
// @desc Create new order and pay
router.get('/', get)

module.exports = router;