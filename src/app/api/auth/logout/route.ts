import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await auth();

  const keycloakIssuer = process.env.AUTH_KEYCLOAK_ISSUER;
  const postLogoutRedirectUri = process.env.NEXT_PUBLIC_API_URL;

  if (!keycloakIssuer || !postLogoutRedirectUri) {
    console.error("Missing Keycloak issuer or redirect URI.");
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const logoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);

  if (session?.idToken) {
    logoutUrl.searchParams.set('id_token_hint', session.idToken);
  }

  return NextResponse.json({ keycloakLogoutUrl: logoutUrl.toString() });
}
