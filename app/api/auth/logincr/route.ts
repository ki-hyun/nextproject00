import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Check if user has password (for OAuth users)
    if (!user.password) {
      return NextResponse.json(
        { message: '소셜 로그인으로 가입된 계정입니다.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Create session or JWT token here
    // For now, we'll return user data (in production, use proper session management)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: '로그인 성공',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 