import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "doha_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function getJwtSecret() {
  return (
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "doha-deck-dev-secret"
  );
}

function sign(input: string) {
  return base64UrlEncode(createHmac("sha256", getJwtSecret()).update(input).digest());
}

export function createSessionToken(admin: {
  id: string;
  email: string;
  name: string;
}) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    } satisfies SessionPayload),
  );
  const unsigned = `${header}.${payload}`;

  return `${unsigned}.${sign(unsigned)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expected = sign(`${header}.${payload}`);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload).toString("utf8")) as SessionPayload;

    if (!parsed.sub || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const payload = verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!payload) {
    return null;
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    return admin;
  } catch (error) {
    console.error("Failed to load admin session", error);
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    return null;
  }

  return admin;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
