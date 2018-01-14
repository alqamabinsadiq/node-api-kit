const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'dish',
    }
    ]
},
    { usePushEach: true },
    {
        timestamps: true
    });

let Favorites = mongoose.model('favorite', favoriteSchema);

module.exports = Favorites;