// models/Recipe.js
import mongoose, {Schema} from 'mongoose';

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        image: { type: String, required: false }, // 레시피 대표 이미지 URL
        user: { type: Schema.Types.ObjectId, ref: "User", required: false }, // 작성자
        ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }], // 재료 리스트
        instructions: [{ type: Schema.Types.ObjectId, ref: "Instruction" }], // 조리법 리스트
        category: { type: String }, // 카테고리 필터용
        cookingTime: { type: Number, required: true }, // 조리시간 추가 (분 단위)
        likes: { type: Number, default: 0 }, // 추천수
        views: { type: Number, default: 0 }, // 조회수
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // 댓글 리스트
    },
    {timestamps: true}
);

export default mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
