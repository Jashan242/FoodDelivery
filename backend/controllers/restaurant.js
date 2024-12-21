const Restaurant = require("../models/restaurant");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const mongoose = require('mongoose');

exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      description,
      isVegOnly,
      averageRating,
      deliveryTime,
      openingHours,
      cuisine,
      owner
    } = req.body;

    // Parse the JSON strings for openingHours and cuisine
    let parsedOpeningHours;
    let parsedCuisine;

    try {
      parsedOpeningHours = JSON.parse(openingHours);
      parsedCuisine = JSON.parse(cuisine);
    } catch (error) {
      return res.status(400).json({ 
        message: "Invalid format for openingHours or cuisine", 
        error 
      });
    }

    // // Handle image upload
    // let imageUrl;
    // if (req.file) {
    //   const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    //   if (cloudinaryResponse) {
    //     imageUrl = cloudinaryResponse.url;
    //   }
    // }

    const avatarUrl=req.files?.avatar[0]?.path;
    const coverImageUrl=req.files?.coverImage[0]?.path;

    if(!avatarUrl){
      return res.status(400).json({message:'Avatar is required'});
    }

    const cloudinaryResponse=await uploadOnCloudinary(avatarUrl);
    if(!cloudinaryResponse){
      return res.status(400).json({message:'Avatar upload failed'});
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      phone,
      email,
      description,
      deliveryTime,
      openingHours: parsedOpeningHours,
      cuisine: parsedCuisine,
      isVegOnly: isVegOnly === 'true',
      averageRating: parseFloat(averageRating) || 0,
      image: cloudinaryResponse.url,
      coverImage: coverImageUrl?.url,
      owner

    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant
    });

  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      message: "Error creating restaurant",
      error: error.message
    });
  }
};


exports.getRestaurant=async(req,res)=>{
    const restaurant=await Restaurant.find();
    res.status(200).send({message:'Restaurant fetched successfully',restaurant});
}

exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            address,
            phone,
            email,
            description,
            deliveryTime,
            cuisine,
            menu,
            isVegOnly,
            foodItems,
            averageRating,
            owner
        } = req.body;

        // Create update object
        const updateFields = {
            name,
            address,
            phone,
            email,
            description,
            deliveryTime,
            menu,
            isVegOnly,
            foodItems,
            averageRating: parseFloat(averageRating) || 0,
            owner
        };

        // Handle cuisine parsing if provided
        if (cuisine) {
            updateFields.cuisine = typeof cuisine === 'string' ? JSON.parse(cuisine) : cuisine;
        }

        // Handle file uploads if provided
        if (req.files?.avatar?.[0]) {
            const avatarResponse = await uploadOnCloudinary(req.files.avatar[0].path);
            if (avatarResponse) {
                updateFields.image = avatarResponse.url;
            }
        }

        if (req.files?.coverImage?.[0]) {
            const coverImageResponse = await uploadOnCloudinary(req.files.coverImage[0].path);
            if (coverImageResponse) {
                updateFields.coverImage = coverImageResponse.url;
            }
        }

        // Use findByIdAndUpdate with { new: true } to return the updated document
        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({
            message: 'Restaurant updated successfully',
            restaurant
        });

    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({
            message: 'Error updating restaurant',
            error: error.message
        });
    }
};

exports.deleteRestaurant=(req,res)=>{
    const {id}=req.params;
    Restaurant.findByIdAndDelete(id)
    .then((restaurant)=>{
        if(!restaurant){
            res.status(404).send({message:'Restaurant not found'});
        }
        res.status(200).send({message:'Restaurant deleted successfully',restaurant});
    })
    .catch((err)=>{
      res.status(500).send({ message: "Error deleting restaurant", err });
    });
};

exports.getRestaurantByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received Owner ID:", id);
    
    // Directly use the id in the query
    const restaurant = await Restaurant.find({ owner: id }).exec();
    console.log("Query Result:", restaurant);
    
    if (!restaurant || restaurant.length === 0) {
      return res.status(404).send({ 
        message: 'No restaurant found for this owner',
        debugInfo: {
          searchedId: id,
          searchedIdType: typeof id
        }
      });
    }
    
    res.status(200).send({ message: 'Restaurant fetched successfully', restaurant });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ 
      message: 'Error fetching restaurant', 
      error: error.message
    });
  }
};





