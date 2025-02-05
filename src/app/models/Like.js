import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
    {
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
{ timestamps: true }); // createdAt, updatedAt 자동 생성

//
// // 모델이 이미 정의되어 있으면 재사용, 아니면 새로 정의
// let Like;
//
// try {
//     Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
// } catch (error) {
//     console.error('Error in defining the Like model:', error);
//     Like = mongoose.model('Like', likeSchema);
// }

export default mongoose.models.Like || mongoose.model('Like', likeSchema);