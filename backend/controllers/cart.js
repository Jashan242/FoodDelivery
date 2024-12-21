const cart = require('../models/cart');
const Cart = require('../models/cart');
const FoodItem = require('../models/foodItem');

exports.addToCart = async (req, res) => {
    try {
        const { foodItem: foodItemId, quantity } = req.body;
        // const userId = req.params.userId;
        const userId = req.user.id;

        // Validate foodItem exists
        const foodItemDetails = await FoodItem.findById(foodItemId);
        if (!foodItemDetails) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Find or initialize cart
        let userCart = await Cart.findOne({ user: userId });

        // If no cart exists, create a new one
        if (!userCart) {
            userCart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0
            });
        }

        // Find if item already exists in cart
        const existingItemIndex = userCart.items.findIndex(
            item => item.foodItem.toString() === foodItemId
        );

        // Update or add item
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            userCart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            userCart.items.push({
                foodItem: foodItemId,
                quantity: quantity
            });
        }

        // Calculate total price
        userCart.totalPrice = userCart.items.reduce((total, item) => {
            return total + (foodItemDetails.price * item.quantity);
        }, 0);

        // Save the updated cart
        await userCart.save();

        // Populate food item details before sending response
        const populatedCart = await Cart.findById(userCart._id)
            .populate('items.foodItem');

        res.status(200).json({
            message: 'Item added to cart successfully',
            cart: populatedCart
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};


exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from token
        const cart = await Cart.findOne({ user: userId }).populate({
            path: 'items.foodItem',
            model: 'FoodItem',
            select: '_id name price description category imageUrl availability ratings restaurant isVeg'
        });  // Get the cart for the logged-in user
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        res.status(200).json({ cart });
        console.log(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

exports.removeFromCart = async (req, res) => {
    const { foodItemId } = req.params; // Extract foodItemId from URL params

    try {
        const userId = req.user.id; // Get the logged-in user's ID from the token

        // Find the user's cart
        const userCart = await Cart.findOne({ user: userId }).populate('items.foodItem'); // Populate food item details

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the food item in the cart
        const itemIndex = userCart.items.findIndex((item) => {
            return item.foodItem._id.toString() === foodItemId; // Ensure foodItem._id matches
        });

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        userCart.items.splice(itemIndex, 1);

        // Recalculate the total price
        userCart.totalPrice = userCart.items.reduce((total, item) => {
            if (!item.foodItem || item.foodItem.price === undefined) {
                console.error('Error: Food item price not found for:', item.foodItem);
                return total; // Skip this item if price is not available
            }
            return total + item.quantity * item.foodItem.price;
        }, 0);

        // Save the updated cart
        await userCart.save();

        // Populate food item details before sending response
        const updatedCart = await Cart.findById(userCart._id).populate('items.foodItem');

        res.status(200).json({
            message: 'Item removed from cart',
            cart: updatedCart,
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({
            message: 'Error removing item from cart',
            error: error.message,
        });
    }
};

exports.clearCart = async (req, res) => {
    try{
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).json({ message: 'Cart cleared' });
    }
    catch(error){
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
}
  
exports.updateCartItem = async (req, res) => {
    const { foodItemId, increment } = req.body; // Increment is a boolean
    const userId = req.user.id;

    try {
        const userCart = await Cart.findOne({ user: userId }).populate('items.foodItem');
        if (!userCart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = userCart.items.findIndex(item => item.foodItem._id.toString() === foodItemId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

        // Update quantity
        if (increment) {
            userCart.items[itemIndex].quantity += 1;
        } else {
            userCart.items[itemIndex].quantity -= 1;
            if (userCart.items[itemIndex].quantity <= 0) {
                userCart.items.splice(itemIndex, 1); // Remove the item if quantity is zero
            }
        }

        // Recalculate total price
        userCart.totalPrice = userCart.items.reduce((total, item) => total + item.foodItem.price * item.quantity, 0);

        await userCart.save();

        const updatedCart = await Cart.findById(userCart._id).populate('items.foodItem');
        res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};
