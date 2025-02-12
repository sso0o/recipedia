import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IIngredient extends Document {
    recipeId: Types.ObjectId;
    ingredient: string;
    quantity: string;
}

const ingredientSchema: Schema<IIngredient> = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    ingredient: { type: String, required: true },
    quantity: { type: String, required: true },
});

export default mongoose.models.Ingredient || mongoose.model<IIngredient>('Ingredient', ingredientSchema);
