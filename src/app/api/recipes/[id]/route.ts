import connectToDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params, searchParams }: { params: Promise<{ id: string }>, searchParams: URLSearchParams }
): Promise<Response> {
    try {
        await connectToDB();

        // params를 await 처리하여 동기 객체로 만듭니다.
        const { id } = await params;
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
