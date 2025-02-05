import {getUserIdFromToken} from "../../../../lib/auth";
import {checkIfUserLikedRecipe, toggleLike} from "@/app/lib/like";
import {NextResponse} from "next/server";


export async function GET(req, { params }) {

    const { id } = await params;
    const data = getUserIdFromToken(req);
    const userId = data.userId;
    const liked = await checkIfUserLikedRecipe(userId, id);
    return NextResponse.json(liked, { status: 200 });
}

export async function POST(req, { params }) {

    const { id } = await params;
    const data = getUserIdFromToken(req);
    const userId = data.userId;
    if (!userId) {
        return NextResponse.json(({ message: "Unauthorized" }), { status: 401 });
    }

    const liked = await toggleLike(userId, id);
    return NextResponse.json(liked, { status: 200 });
}