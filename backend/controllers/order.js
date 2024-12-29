const Order = require("../models/order");
const Cart = require("../models/cart");
const Restaurant = require("../models/restaurant");

const createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                message: "User not authenticated",
                error: true
            });
        }

        const userId = req.user.id;
        console.log("User ID from auth:", userId);

        const { 
            restaurantOrders, 
            deliveryAddress, 
            paymentMethod, 
            paymentStatus,
            totalAmount 
        } = req.body;

        const ordersWithRestaurantNames = await Promise.all(
            restaurantOrders.map(async (order) => {
                const restaurant = await Restaurant.findById(order.restaurantId);
                return {
                    ...order,
                    restaurantName: restaurant ? restaurant.name : 'Unknown Restaurant'
                };
            })
        );

        const order = new Order({
            userId,
            restaurantOrders: ordersWithRestaurantNames,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            paymentStatus
        });

        console.log("Order before save:", order);

        const savedOrder = await order.save();

        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], totalPrice: 0 } }
        );

        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        // console.error("Order creation error:", error);
        // console.error("Full error object:", JSON.stringify(error, null, 2));
        res.status(500).json({ 
            message: "Failed to create order",
            error: error.message 
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

const getOrderByRestaurantId = async (req, res) => {
    const restaurantId=req.params.id;
    try {
        const orders = await Order.find({
             restaurantOrders: { $elemMatch: { restaurantId: restaurantId } }
        });
        res.status(200).json({ orders });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

const updateOrderPaymentStatus = async (req, res) => {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order payment status", error: error.message });
    }
};
const updateOrderStatus = async (req, res) => {
    const orderId = req.params.id; // Order ID from URL
    const { restaurantOrderId, status } = req.body; // RestaurantOrder ID and new status from body

    try {
        // Find the main order by its ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Find the specific restaurant order from the restaurantOrders array using the restaurantOrderId
        const restaurantOrder = order.restaurantOrders.find(ro => ro._id.toString() === restaurantOrderId);
        if (!restaurantOrder) {
            return res.status(404).json({ message: "Restaurant order not found" });
        }

        // Update the status of the restaurant order
        restaurantOrder.status = status;

        // Save the updated order document
        await order.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Update order status error:", error);
        return res.status(500).json({ 
            message: "Failed to update order status", 
            error: error.message 
        });
    }
};



module.exports = { createOrder, getOrders, getOrderByRestaurantId, updateOrderPaymentStatus, updateOrderStatus };

