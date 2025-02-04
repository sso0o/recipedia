// /pages/api/signup.js
import connectToDB  from '../../../lib/mongodb'; // DB 연결 함수
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, email, password } = req.body;

        // 데이터베이스 연결
        await connectToDB();

        // 이메일 중복 확인
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        try {
            // 새로운 유저 생성
            const newUser = new User({
                username,
                email,
                password,
            });

            // 유저 저장
            await newUser.save();

            // 성공 응답
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
