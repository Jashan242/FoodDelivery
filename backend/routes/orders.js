const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrderByRestaurantId, updateOrderPaymentStatus, updateOrderStatus } = require("../controllers/order");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderByRestaurantId);
router.put("/:id/pstatus", updateOrderPaymentStatus);
router.put('/order/:orderId/restaurant/:restaurantOrderId/status', updateOrderStatus);

module.exports = router;