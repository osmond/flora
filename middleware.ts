import { NextRequest, NextResponse } from "next/server";
import {
  BASIC_AUTH_PASSWORD,
  BASIC_AUTH_USER,
} from "./src/lib/config";

export function middleware(req: NextRequest) {
  const expectedUser = BASIC_AUTH_USER;
  const expectedPassword = BASIC_AUTH_PASSWORD;

  // Skip auth if credentials are not set
  if (!expectedUser || !expectedPassword) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === expectedUser && password === expectedPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
