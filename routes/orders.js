// routes/orders.js
const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const Order = require("../models/order");

const router = express.Router();

// Place an order (Customer only)
router.post("/", authMiddleware, roleMiddleware(["customer"]), async (req, res) => {
  try {
    const order = new Order({ ...req.body, customer: req.user._id});
    if (!req.body.products || req.body.products.length === 0) {
        return res.status(400).json({ message: "No products provided in the order" });
    }else{
    await order.save();
    }
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});

// Get all orders (Admin only)
router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const {customer} = req.query
    if(!customer){
      return res.status(404).send("No customer data found")
    }
    const orders = await Order.find({customer}).populate("customer", "name email");
    if(orders.length === 0){
      return res.status(404).send("No orders for the customer")
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

//To delete an order
router.delete("/:id", authMiddleware,roleMiddleware(["customer"]), async (req, res) => {
  try {
    // Retrieve the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.customer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this order" });
    }
    await order.deleteOne();
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
