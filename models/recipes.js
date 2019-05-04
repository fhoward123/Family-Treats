const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = Schema(
    {
        username: String,
        name: { type: String, required: true },
        directions: String,
        image: String,
        tags: [String]
    }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
