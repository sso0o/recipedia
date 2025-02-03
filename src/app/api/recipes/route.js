// /app/api/recipes/route.js
import { Formidable } from 'formidable';
import { NextResponse } from 'next/server';
import connectToDB  from '../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../models/Recipe';
import path from 'path';
import fs from 'fs/promises';


export async function POST(req) {
    try {
        // 업로드 폴더 생성
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // ✅ 최신 formidable 사용법
        const form = new Formidable({ uploadDir, keepExtensions: true, multiples: false });

        // ✅ `formidable`에서 `req.formData()` 사용
        const parsedData = await req.formData();
        const file = parsedData.get("image"); // 이미지 파일

        // 파일 저장
        const filePath = path.join(uploadDir, file.name);
        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        // DB 저장
        await connectToDB();
        const newRecipe = await Recipe.create({
            title: parsedData.get("title"),
            description: parsedData.get("description"),
            category: parsedData.get("category"),
            cookingTime: parsedData.get("cookingTime"),
            image: `/uploads/${file.name}`
        });

        return new NextResponse(
            JSON.stringify({ message: '레시피가 성공적으로 등록되었습니다.', recipe: newRecipe }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('레시피 생성 실패:', error);
        return new NextResponse(
            JSON.stringify({ error: '레시피 생성에 실패했습니다.', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}


export async function GET() {
    try {
        // MongoDB 연결
        await connectToDB();

        // 모든 레시피 가져오기 (Mongoose 사용)
        const recipes = await Recipe.find({});


        // 성공적인 응답 반환
        return new Response(JSON.stringify(recipes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch recipes" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
