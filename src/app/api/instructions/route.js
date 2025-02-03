import connectToDB from '../../lib/mongodb'; // DB 연결 함수
import Instruction from '../../models/Instruction'
import {NextResponse} from "next/server";


// [POST] 새 조리법 추가
export async function POST(req) {
    try {
        const { recipeId, step, order } = await req.json(); // 클라이언트에서 받은 JSON 데이터를 추출
        // MongoDB 연결
        await connectToDB();

        // 새로운 레시피 생성
        const newInstruction = await Instruction.create({ recipeId, step, order });

        // 성공적인 응답 반환
        return new Response(
            JSON.stringify({ message: "재료가 성공적으로 등록되었습니다.", data: newInstruction }),
            { status: 201 }
        );
    } catch (error) {
        // 에러 처리
        return new Response(JSON.stringify({ error: 'Failed to save ingredient' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// [GET] 특정 레시피의 모든 조리법
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId");

        if (!recipeId) return NextResponse.json({ error: "recipeId is required" }, { status: 400 });

        await connectToDB();
        const instructions = await Instruction.find({ recipeId }).sort("order");

        return NextResponse.json(instructions, { status: 200 });
    } catch (error) {
        console.error("조리법 조회 실패:", error);
        return NextResponse.json({ error: "Failed to fetch instructions" }, { status: 500 });
    }
}