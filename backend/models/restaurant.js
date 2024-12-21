const mongoose=require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    openingHours: {
      type: Map,
      of: String,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    cuisine: {
      type: [String],
      required: true,
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      get: v => Math.round(v * 10) / 10,
      set: v => Math.round(v * 10) / 10
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVegOnly: {
      type: Boolean,
      default: false,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem', // Reference to the FoodItem schema
      },
    ],
    image: {
      type: String, // URL or file path of the restaurant's image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  });
  
  module.exports = mongoose.model('Restaurant', restaurantSchema);