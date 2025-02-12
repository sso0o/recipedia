import connectToDB from '@/lib/mongodb';
import {NextResponse} from "next/server";
import path from "path";
import fs from 'fs/promises';
import Recipe from '@/models/Recipe';



export async function POST(req: Request): Promise<NextResponse> {
    try {
        // 업로드 폴더 생성
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // 최신 방식: req.formData() 사용
        const parsedData = await req.formData();

        // 이미지 파일 가져오기 (FormDataEntryValue를 File로 단언)
        const file = parsedData.get("image") as File;
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 파일 저장
        const filePath = path.join(uploadDir, file.name);
        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        // DB 연결 및 레시피 생성
        await connectToDB();
        const newRecipe = await Recipe.create({
            title: parsedData.get("title") as string,
            description: parsedData.get("description") as string,
            category: parsedData.get("category") as string,
            cookingTime: parsedData.get("cookingTime") as string,
            image: `/uploads/${file.name}`,
        });

        return new NextResponse(
            JSON.stringify({
                message: '레시피가 성공적으로 등록되었습니다.',
                recipe: newRecipe,
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: unknown) {
        console.error('레시피 생성 실패:', error);
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new NextResponse(
            JSON.stringify({
                error: '레시피 생성에 실패했습니다.',
                details: errorMessage,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function GET(req: Request): Promise<Response> {
    try {
        // MongoDB 연결
        await connectToDB();

        // 모든 레시피 가져오기 (Mongoose 사용)
        const recipes = await Recipe.find({});

        return new Response(JSON.stringify(recipes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error("Error fetching recipes:", error);
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(
            JSON.stringify({ error: "Failed to fetch recipes", details: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}