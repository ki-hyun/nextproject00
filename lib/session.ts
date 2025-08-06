import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {

  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "delicious-karrot",
    // password: env("COOKIE_PASSWORD"),
    password: process.env.COOKIE_PASSWORD!,
  });
}