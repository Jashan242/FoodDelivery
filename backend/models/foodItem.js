const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Food item name is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: [String],
    required: [true, "Category is required"],
    // enum: ["Starter", "Main Course", "Dessert", "Beverage", "Snack"]
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant", // Reference to Restaurant Schema
    required: [true, "Restaurant ID is required"]
  },
  imageUrl: {
    type: String,
    trim: true
  },
  availability: {
    type: Number,
    required: [true, "Availability is required"],
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVeg: {
    type: Boolean,
    default: false
  }
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
