// models/Ingredient.js
import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    ingredient: { type: String, required: true },
    quantity: { type: String, required: true },
});

export default mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);
