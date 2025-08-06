"use server";

// import {
//   PASSWORD_MIN_LENGTH,
//   PASSWORD_REGEX,
//   PASSWORD_REGEX_ERROR,
// } from "@/lib/constants";
import bcrypt from "bcrypt";
import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z.string().email().toLowerCase()
    .refine(checkEmailExists, "없는 이메일이네"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    // .min(PASSWORD_MIN_LENGTH)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});


export async function logIn(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) { /////////////////////////// 로그인 양식 실패
    console.log(result.error.flatten());
    return result.error.flatten();
  } else { ///////////////////////////////////////// 입력정상 로그인 시도
    console.log("login -----------------------------------\n"+result.data);

    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();

      redirect("/");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password."],
          email: [],
        },
      };
    }
  
  }
}