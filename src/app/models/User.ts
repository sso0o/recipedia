import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// 사용자 Document 인터페이스 정의
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    favorites: mongoose.Types.ObjectId[];
    isPasswordMatch: (password: string) => Promise<boolean>;
}

interface EmailValidatorProps {
    value: string;
}


const userSchema: Schema<IUser> = new mongoose.Schema(
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
                validator: (v: string) => /\S+@\S+\.\S+/.test(v), // 이메일 형식 검증
                message: (props: EmailValidatorProps) => `${props.value} 는 유효한 이메일 주소가 아닙니다.`,
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // 비밀번호 최소 길이 설정
        },
        profileImage: {
            type: String,
        }, // 프로필 사진 URL
        favorites: [
            {
                type: Schema.Types.ObjectId,
                ref: "Recipe",
            },
        ], // 즐겨찾기한 레시피
    },
    { timestamps: true } // createdAt, updatedAt 자동 생성
);

// 비밀번호 암호화 (사용자가 비밀번호를 저장하기 전에 실행)
// pre 훅에서는 function() {} 문법을 사용하여 this를 바인딩합니다.
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next(); // 비밀번호가 변경되지 않으면 아무것도 하지 않음
    this.password = await bcrypt.hash(this.password, 10); // 비밀번호 해싱
    next();
});

// 비밀번호 검증 인스턴스 메소드
userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password); // 입력한 비밀번호와 저장된 해시 비밀번호 비교
};

// 모델 재정의 방지를 위해 이미 정의된 모델이 있으면 재사용
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
