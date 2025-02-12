import connectToDB from '@/lib/mongodb';
import {NextResponse} from "next/server";
import Instruction from '@/models/Instruction';

interface InstructionPayload {
    recipeId: string;
    step: string;
    order: number;
}

// [POST] 새 조리법 추가
export async function POST(req: Request): Promise<Response> {
    try {
        // 클라이언트에서 받은 JSON 데이터를 추출
        const { recipeId, step, order } = (await req.json()) as InstructionPayload;

        // MongoDB 연결
        await connectToDB();

        // 새로운 조리법 생성
        const newInstruction = await Instruction.create({ recipeId, step, order });

        // 성공적인 응답 반환
        return new Response(
            JSON.stringify({
                message: "조리법이 성공적으로 등록되었습니다.",
                data: newInstruction,
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error: unknown) {
        let errorMessage = "Failed to save instruction";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// [GET] 특정 레시피의 모든 조리법 조회
export async function GET(req: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) {
            return NextResponse.json({ error: "recipeId is required" }, { status: 400 });
        }

        await connectToDB();
        const instructions = await Instruction.find({ recipeId }).sort("order");

        return NextResponse.json(instructions, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = "Failed to fetch instructions";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("조리법 조회 실패:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}