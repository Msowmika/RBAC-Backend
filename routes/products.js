// routes/products.js
const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const Product = require("../models/product");

const router = express.Router();

// Add a product (Vendor only)
router.post("/", authMiddleware, roleMiddleware(["vendor"]), async (req, res) => {
  try {
    const product = new Product({ ...req.body, vendor: req.user._id });
    console.log("product:", product)
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

//delete product
router.delete("/:id", authMiddleware, roleMiddleware(["vendor"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product){
      return res.status(400).json({message:"Product not Found"});
    }
    if(product.vendor.toString() !== req.user.id){
      return res.status(403).json({message:"You are not authorized to delete this product"})
    }
    await product.deleteOne()
    return res.status(200).json({message :"Product deleted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

//To update product details
router.post("/:id", authMiddleware, roleMiddleware(["vendor"]), async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    // Update product details
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    await product.save();

    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({ message: "Error updating product", error: error.message });
  }
});


// Get all products
router.get("/", async (req, res) => {
  try {
    const {product} = req.query
    if(!product){
      return res.status(404).send("No product with that ID found")
    }
    const products = await Product.find().populate("vendor", "name email");
    if(products.length === 0){
      return res.status(404).send("No products were found from this vendor")
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

module.exports = router;
