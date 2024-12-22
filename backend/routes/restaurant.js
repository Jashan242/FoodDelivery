const express=require('express');
const router=express.Router();
const {createRestaurant, getRestaurant, updateRestaurant, deleteRestaurant,getRestaurantByOwner,getRestaurantById}=require('../controllers/restaurant');
// const {upload}=require('../middlewares/multer');
const multer = require('multer');

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50mb size limit
  }
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

router.post('/',upload,createRestaurant);

router.get('/',getRestaurant);
router.put('/:id',updateRestaurant);
router.delete('/:id',deleteRestaurant);
router.get('/owner/:id',getRestaurantByOwner);
router.get('/:id',getRestaurantById);

module.exports=router;