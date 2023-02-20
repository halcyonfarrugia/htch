const Product = require('../../models/Product')
const path = require('path')

const search = async (req, res) => {
    try {
        const productName = req.query.name;
        const category = req.query.category;

        let products;
        if (productName) {
            products = await Product.find({ name: { $regex: productName, $options: 'i' } });
        } else if (category) {
            products = await Product.find({ category: category })
        } else {
            products = await Product.find()
        }
        res.status(200).json({ status: true, products })
    } catch (error) {
        console.log(`Error occurred in ${path.join(__dirname, __filename)}: `, error)
    }
}

module.exports = { search }