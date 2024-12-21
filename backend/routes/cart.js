const express=require('express');
const router=express.Router();
const {addToCart,getCart,removeFromCart, clearCart, updateCartItem}=require('../controllers/cart');
const {checkAuth}=require('../middlewares/auth');

router.post('/', checkAuth, addToCart);
router.get('/', checkAuth, getCart);
router.post('/remove/:foodItemId', checkAuth, removeFromCart);
router.post('/clear', checkAuth, clearCart);
router.post('/update', checkAuth, updateCartItem);
module.exports=router;