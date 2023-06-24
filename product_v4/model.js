const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Field Name Harus Ada']
  },
  price: {
    type: Number,
    required: true,
    min:10000,
    max:10000000000
  },
  stock: {
    type: Number,
  },
  status: {
    type: Boolean,
    default: false,
  },
  image_url: {
    type: String
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
