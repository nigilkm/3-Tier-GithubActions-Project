const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      minlength: 1,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'quantity cannot be negative'],
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
