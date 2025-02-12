import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInstruction extends Document {
    recipeId: Types.ObjectId;
    step: string;
    order: number;
}

const instructionSchema: Schema<IInstruction> = new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    step: { type: String, required: true },
    order: { type: Number, required: true },
});

export default mongoose.models.Instruction || mongoose.model<IInstruction>('Instruction', instructionSchema);
