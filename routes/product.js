const { create } = require('../controllers/product/create');
const { search } = require('../controllers/product/search')
const { verifyToken } = require('../middleware/verify');
const multer = require('multer')
const path = require('path');
const { get } = require('../controllers/product/get');

const router = require('express').Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, req.user.id + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage })

// @route POST /api/product/
// @perms Admin only
// @desc Create new product
router.post('/', verifyToken, upload.single('img'), create)

// @route GET /api/product?name=<name>&category=<category>
// @perms Admin only
// @desc Search or retrieve for products
router.get('/', search)

// @route GET /api/product/related/:id
// @perms Admin only
// @desc Search or retrieve for products
router.get('/:id', get)

module.exports = router;