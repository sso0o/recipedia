// /models/User.js
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

// 유저 스키마 정의
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // 이메일은 중복될 수 없도록 설정
            validate: {
                validator: (v) => {
                    return /\S+@\S+\.\S+/.test(v); // 이메일 형식 검증
                },
                message: (props) => `${props.value} 는 유효한 이메일 주소가 아닙니다.`,
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // 비밀번호 최소 길이 설정
        },
        profileImage: {
            type: String
        }, // 프로필 사진 URL
        favorites: [{
            type: Schema.Types.ObjectId,
            ref: "Recipe"
        }], // 즐겨찾기한 레시피
    },
    { timestamps: true }); // createdAt, updatedAt 자동 생성

// 비밀번호 암호화 (사용자가 비밀번호를 저장하기 전에 실행)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // 비밀번호가 변경되지 않으면 아무것도 하지 않음
    this.password = await bcrypt.hash(this.password, 10); // 비밀번호를 해싱
    next();
});

// 비밀번호 검증 메소드
userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password); // 입력한 비밀번호와 저장된 해시 비밀번호 비교
};

export default mongoose.models.User || mongoose.model('User', userSchema);