let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// loading currency type to mongoose.
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

let commentSchema = new Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
}, {
    timestamps: true
  });

let dishSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  price: {
    type: Currency,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  comments: [commentSchema]
}, {
    timestamps: true
  });

let Dishes = mongoose.model('dish', dishSchema);

module.exports = Dishes;