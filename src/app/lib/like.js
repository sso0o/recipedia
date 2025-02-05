import Like from "../models/Like";


export async function checkIfUserLikedRecipe(userId, recipeId) {
    if (!userId) return false; // 로그인 안 한 경우 false 반환
    const liked = await Like.exists({ userId, recipeId });
    if (liked) {
        return true; // 좋아요한 경우 true 반환
    }else{
        return false; // 좋아요 안 한 경우 false 반환
    }
}


export async function toggleLike(userId, recipeId) {
    if (!userId) throw new Error("Unauthorized"); // 로그인 안 된 경우 예외 발생

    const existingLike = await Like.findOne({ userId, recipeId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return false; // 좋아요 취소됨
    } else {
        await Like.create({ userId, recipeId });
        return true; // 좋아요 추가됨
    }
}
