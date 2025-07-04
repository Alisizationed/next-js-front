// middleware.ts
import { getToken } from "next-auth/jwt";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return signIn();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/recipe/*"],
};
