// models/Comment.js
import mongoose, {Schema} from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipe: {
            type: Schema.Types.ObjectId,
            ref: "Recipe",
            required: true
        },
        text: {
            type: String,
            required: true
        },
    },
    { timestamps: true }); // createdAt, updatedAt 자동 생성


export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
