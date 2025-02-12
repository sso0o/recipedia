import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILike extends Document {
    user: Types.ObjectId;
    recipe: Types.ObjectId;
}

const likeSchema: Schema<ILike> = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
    },
    { timestamps: true } // 좋아요 생성/수정 시간을 자동으로 관리 (선택 사항)
);

export default mongoose.models.Like || mongoose.model<ILike>('Like', likeSchema);
