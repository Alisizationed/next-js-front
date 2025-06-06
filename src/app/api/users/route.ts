/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server'

import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

async function getAdminAccessToken(): Promise<string | null> {
  const KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER!;
  const KEYCLOAK_ADMIN_CLIENT_ID = process.env.AUTH_KEYCLOAK_ID!;
  const KEYCLOAK_ADMIN_CLIENT_SECRET = process.env.AUTH_KEYCLOAK_SECRET!;
  const tokenUrl = `${KEYCLOAK_ISSUER}/protocol/openid-connect/token`;

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: KEYCLOAK_ADMIN_CLIENT_ID,
        client_secret: KEYCLOAK_ADMIN_CLIENT_SECRET,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to get admin token: ${response.status} - ${JSON.stringify(errorData)}`,
      );
      return null;
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error obtaining admin access token:", error);
    return null;
  }
}

export async function GET(request: Request) {
  const KEYCLOAK_API = process.env.AUTH_KEYCLOAK_API!;
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  const adminAccessToken = await getAdminAccessToken();
  if (!adminAccessToken) {
    return NextResponse.json(
      { message: "Failed to get Keycloak admin token" },
      { status: 500 },
    );
  }

  const usersUrl = `${KEYCLOAK_API}/users`;
  try {
    const keycloakResponse = await fetch(usersUrl, {
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!keycloakResponse.ok) {
      const errorData = await keycloakResponse.json();
      console.error(
        `Error from Keycloak Admin API: ${keycloakResponse.status} - ${JSON.stringify(errorData)}`,
      );
      return NextResponse.json(
        { message: "Failed to fetch users from Keycloak" },
        { status: keycloakResponse.status },
      );
    }

    const users = await keycloakResponse.json();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users from Keycloak:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
