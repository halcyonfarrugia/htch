const Product = require("../../models/Product")
const mongoose = require('mongoose')

const get = async (req, res) => {
  try {
    const id = req.params.id;
    // find the product with the given id
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // find similar products based on a shared category
    const relatedItems = await Product.aggregate([
      {
        $match: {
          category: product.category,
          _id: { $ne: mongoose.Types.ObjectId(id) }, // Exclude the original product from the results
        },
      },
      { $sample: { size: 3 } }, // Randomly select 3 items from the matched products
    ]);
    res.status(200).json({ status: true, product, relatedItems });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { get }