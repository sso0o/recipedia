import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRecipe extends Document {
    title: string;
    description?: string;
    image?: string;
    user?: Types.ObjectId;
    ingredients: Types.ObjectId[];
    instructions: Types.ObjectId[];
    category?: string;
    cookingTime: number;
    likes: number;
    views: number;
    comments: Types.ObjectId[];
}

const recipeSchema: Schema<IRecipe> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        ingredients: [
            {
                type: Schema.Types.ObjectId,
                ref: "Ingredient",
            },
        ],
        instructions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Instruction",
            },
        ],
        category: {
            type: String,
        },
        cookingTime: {
            type: Number,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', recipeSchema);
