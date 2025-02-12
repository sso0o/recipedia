import connectToDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
): Promise<Response> {
    try {
        await connectToDB();

        const { id } = await params;
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return new Response("레시피를 찾을 수 없습니다.", { status: 404 });
        }

        return new Response(JSON.stringify(recipe), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        return new Response("서버 오류 발생", { status: 500 });
    }
}
