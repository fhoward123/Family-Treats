const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = Schema(
    {
        username: String,
        name: { type: String, required: true },
        directions: String,
        image: String,
        tag: {
            type: String,
            enum: ['dinner', 'veggie', 'bread', 'sweets', 'keto']
        }
    }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
