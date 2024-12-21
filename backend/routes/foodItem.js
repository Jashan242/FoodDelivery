const express=require('express');
const router=express.Router();
const {createFoodItem,getAllFoodItemByRestaurant,updateFoodItem,deleteFoodItem,getFoodItemById}=require('../controllers/food');
const multer = require('multer');

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50mb size limit
  }
}).single('avatar');



router.post('/',upload,createFoodItem);
router.get('/restaurant/:id',getAllFoodItemByRestaurant);
router.put('/:id',updateFoodItem);
router.delete('/:id',deleteFoodItem);
router.get('/:id',getFoodItemById);

module.exports=router;