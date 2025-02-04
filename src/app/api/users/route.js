import connectToDB  from '../../lib/mongodb'; // DB 연결 함수
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        // 요청 본문에서 유저 데이터 받아오기
        const { username, email, password } = await req.json();

        // MongoDB 연결
        await connectToDB();

        // 유저가 이미 존재하는지 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // 에러 처리
            return new Response(JSON.stringify({ error: "이미 존재하는 이메일입니다." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 새로운 유저 생성
        const newUser = await User.create({ username, email, password });

        // 성공적인 응답 반환
        return new Response(JSON.stringify({ message: 'newUser Created', user: newUser }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        // 에러가 mongoose 유효성 검사 오류라면, 메시지 추출
        let errorMessage = 'Failed to create newUser';

        if (err.name === 'ValidationError') {
            // 유효성 검사 오류 메시지를 errorMessage에 할당
            errorMessage = err.message;
        }
        // 에러 처리
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function GET(req) {
    try {
        await connectToDB();

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}