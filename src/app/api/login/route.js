import User from "../../models/User";
import jwt from "jsonwebtoken";
import connectToDB  from '../../lib/mongodb'; // DB 연결 함수
import { NextResponse } from "next/server";


export async function POST(req, res) {
    const { email, password } = await req.json();

    // 데이터베이스 연결
    await connectToDB();

    // 유저 찾기
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 비밀번호 비교
    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // JWT 발급
    const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return NextResponse.json({ token }, { status: 200 });
}