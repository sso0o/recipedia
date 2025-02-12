import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    try {
        // 데이터베이스 연결
        await connectToDB();

        // 이메일 중복 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already in use" },
                { status: 400 }
            );
        }

        // 새로운 유저 생성
        const newUser = new User({
            username,
            email,
            password: password,
        });

        // 유저 저장
        await newUser.save();

        // 성공 응답
        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error: unknown) {
        let errorMessage = "Unknown error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error(errorMessage)
        return NextResponse.json(
            { message: errorMessage, error: errorMessage },
            { status: 500 }
        );
    }
}

// export default POST;