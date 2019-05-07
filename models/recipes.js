const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = Schema(
    {
        submitter: String,
        name: { type: String, required: true },
        directions: String,
        image: String,
        tag: {
            type: String,
            enum: ['dinner', 'veggie', 'bread', 'sweets', 'keto'],
            required: true
        }
    }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
