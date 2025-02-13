import connectToDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
): Promise<Response> {
    try {
        await connectToDB();

        // params는 이미 동기적인 객체이므로 await 제거
        const { id } = params;
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return new Response("레시피를 찾을 수 없습니다.", { status: 404 });
        }

        return new Response(JSON.stringify(recipe), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error(error);
        return new Response("서버 오류 발생", { status: 500 });
    }
}
