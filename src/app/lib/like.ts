import Like from "@/models/Like";

export async function checkIfUserLikedRecipe(
    userId: string | null,
    recipeId: string
): Promise<boolean> {
    if (!userId) return false; // 로그인 안 한 경우 false 반환
    const liked = await Like.exists({ userId, recipeId });
    return Boolean(liked);
}

export async function toggleLike(
    userId: string | null,
    recipeId: string
): Promise<boolean> {
    if (!userId) throw new Error("Unauthorized"); // 로그인 안 된 경우 예외 발생

    const existingLike = await Like.findOne({ user: userId, recipe: recipeId });

    if (existingLike) {
        await Like.deleteOne({ _id: existingLike._id });
        return false; // 좋아요 취소됨
    } else {
        await Like.create({ user: userId, recipe: recipeId });
        return true; // 좋아요 추가됨
    }
}
