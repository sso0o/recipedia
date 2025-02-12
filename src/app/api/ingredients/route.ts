import connectToDB from '@/lib/mongodb';
import {NextResponse} from "next/server";
import Ingredient from '@/models/Ingredient';

interface IngredientPayload {
    recipeId: string;
    ingredient: string;
    quantity: string;
}

// [POST] 새 재료 추가
export async function POST(req: Request): Promise<Response> {
    try {
        // 클라이언트에서 받은 JSON 데이터 추출
        const { recipeId, ingredient, quantity } = (await req.json()) as IngredientPayload;

        // MongoDB 연결
        await connectToDB();

        // 새로운 재료 생성
        const newIngredient = await Ingredient.create({ recipeId, ingredient, quantity });

        // 성공적인 응답 반환
        return new Response(
            JSON.stringify({
                message: "재료가 성공적으로 등록되었습니다.",
                data: newIngredient,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: unknown) {
        let errorMessage = "Failed to save ingredient";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// [GET] 특정 레시피의 모든 재료 조회
export async function GET(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            return NextResponse.json(
                { error: "recipeId is required" },
                { status: 400 }
            );
        }

        await connectToDB();
        const ingredients = await Ingredient.find({ recipeId });

        return NextResponse.json(ingredients, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = "Failed to fetch ingredients";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("재료 조회 실패:", errorMessage);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}