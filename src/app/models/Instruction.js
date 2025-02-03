// models/Instruction.js
import mongoose from 'mongoose';

const instructionSchema = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    step: { type: String, required: true },
    order: { type: Number, required: true },
});


export default mongoose.models.Instruction || mongoose.model('Instruction', instructionSchema);
