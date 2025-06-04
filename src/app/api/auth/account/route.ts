'use server'

import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json(`${process.env.AUTH_KEYCLOAK_ISSUER}/account`);
}