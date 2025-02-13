import { getUserIdFromToken } from "@/lib/auth";
import { checkIfUserLikedRecipe, toggleLike } from "@/lib/like";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    id: string;
}

export async function GET( req: NextRequest, { params }: { params: Promise<Params> }
): Promise<Response> {
    // 동적 라우트 매개변수는 await 처리합니다.
    const { id } = await params;
    const data: { userId: string } | null = getUserIdFromToken(req);
    if (!data) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId: string = data.userId;

    // 유저의 좋아요 여부를 확인하는 함수 호출
    const liked = await checkIfUserLikedRecipe(userId, id);
    return NextResponse.json(liked, { status: 200 });
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<Params> }
): Promise<Response> {
    const { id } = await params;
    const data = getUserIdFromToken(req);
    if (!data) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = data.userId;
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 좋아요 토글 처리
    const liked = await toggleLike(userId, id);
    return NextResponse.json(liked, { status: 200 });
}
