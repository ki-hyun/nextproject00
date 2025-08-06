"use server";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import { z } from "zod";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");

const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const passwordRegex = new RegExp(
  /^(?=.*[a-z]).+$/
);

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "사용자명을 입력해주세요") // 빈문자열인지 확인
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "No potatoes allowed!"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH)
    .regex(passwordRegex, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 사용자명 입니다",
        path: ["username"],
        fatal: true, // 이 에러 발생시 중단
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 존재하는 이메일 입니다",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPasswords, {
    message: "비밀번호 확인 하세요",
    path: ["confirm_password"],
  });


// export async function createAccount(prevState: any, formData: FormData) {
export async function createAccount(prevState: unknown, formData: FormData) {
  console.log("createAccount")

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  console.log("입력된 데이터:", data);

  // const result = formSchema.safeParse(data);
  const result = await formSchema.safeParseAsync(data);  
  if (!result.success) {
    console.log("=== Zod 에러 상세 정보 ===");
    console.log("에러 메시지:", result.error.message);
    console.log("에러 코드:", result.error.issues);
    console.log("========================");

    console.log(result.error.flatten())

    // return {
    //   errors: result.error.flatten(),
    //   values: data, // 입력값도 함께 반환
    // };

    return result.error.flatten();
    
  } else {// 계정 만들기
    console.log("result-------------------------------------------");
    console.log(result);
    // console.log(cookies());

    const hashedPassword = await bcrypt.hash(result.data.password, 11);
    // console.log(hashedPassword)
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();

    console.log("session------------------------------------------");
    console.log(session)

    redirect("/")
    // redirect("/profile")
  }
  
  console.log("okok login")
}