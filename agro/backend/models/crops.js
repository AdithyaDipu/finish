const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the farmer user
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    
  },
  stripePriceId: String, // New field to link with Stripe Pricing
  isPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('Crop', cropSchema);
