// importing packages.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

let Currency = mongoose.Types.Currency;

// Promotion's schema
let promSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ""
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  });

let Promotions = mongoose.model('promotion', promSchema);
module.exports = Promotions;
