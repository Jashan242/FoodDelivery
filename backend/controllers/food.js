const FoodItem = require("../models/foodItem");
const {uploadOnCloudinary}=require('../utils/cloudinary');

exports.createFoodItem = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    vegOnly,
    restaurant,
    category,
    availability,
    ratings,
  } = req.body;

  const avatarUrl=req.file?.path;
  if(!avatarUrl){
    return res.status(400).json({message:'Avatar is required'});
  }
  const cloudinaryResponse=await uploadOnCloudinary(avatarUrl);
  if(!cloudinaryResponse){
    return res.status(400).json({message:'Avatar upload failed'});
  }


  FoodItem.create({
    name,
    price,
    description,
    vegOnly,
    restaurant,
    category,
    imageUrl:cloudinaryResponse.url,
    availability,
    ratings,
  }).then((foodItem)=>{
    res.status(200).send({ message: "Food item created successfully", foodItem });
  }).catch((err)=>{
    res.status(500).send({ message: "Error creating food item", err });
  });
};

exports.getAllFoodItemByRestaurant = async (req, res) => {
    const { id } = req.params; // Get the restaurant ID from the URL parameter
    try {
        const foodItems = await FoodItem.find({ restaurant: id });
        
        if (!foodItems || foodItems.length === 0) {
            return res.status(404).send({ message: 'Food items not found for this restaurant' });
        }

        res.status(200).send({ message: 'Food items fetched successfully', foodItems });
    } catch (err) {
        res.status(500).send({ message: 'Error fetching food items', err });
    }
};

exports.updateFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = { ...req.body };
        
        // Handle image upload if a new image is provided
        if (req.file) {
            const avatarUrl = req.file.path;
            const cloudinaryResponse = await uploadOnCloudinary(avatarUrl);
            
            if (!cloudinaryResponse) {
                return res.status(400).json({ message: 'Image upload failed' });
            }
            
            updateFields.imageUrl = cloudinaryResponse.url;
        }

        // Remove undefined fields
        Object.keys(updateFields).forEach(key => 
            updateFields[key] === undefined && delete updateFields[key]
        );

        // Validate required fields
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        const foodItem = await FoodItem.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json({ 
            message: 'Food item updated successfully', 
            foodItem 
        });

    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ 
            message: 'Error updating food item', 
            error: err.message 
        });
    }
};

exports.deleteFoodItem = async (req, res) => {
    const { id } = req.params;
    try {
        await FoodItem.findByIdAndDelete(id);
        res.status(200).send({ message: 'Food item deleted successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error deleting food item', err });
    }
}


exports.getFoodItemById=async(req,res)=>{
    const {id}=req.params;
    try{
        const foodItem=await FoodItem.findById(id);
        if(!foodItem){
            return res.status(404).send({message:'Food item not found'});
        }
        res.status(200).send({message:'Food item fetched successfully',foodItem});
    }catch(err){
        res.status(500).send({message:'Error fetching food item',err});
    }
}
