import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export const SESSION_COOKIE_NAME = "doha_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type AdminTokenPayload = {
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

function getTokenSecret() {
  const secret = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD;

  if (!secret) {
    throw new Error("JWT_SECRET 또는 ADMIN_PASSWORD 환경 변수가 필요합니다.");
  }

  return secret;
}

function sign(input: string) {
  return base64UrlEncode(createHmac("sha256", getTokenSecret()).update(input).digest());
}

export function createAdminToken(admin: { id: string; email: string; name: string }) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    } satisfies AdminTokenPayload),
  );
  const unsigned = `${header}.${payload}`;

  return `${unsigned}.${sign(unsigned)}`;
}

export function verifyAdminToken(token: string | undefined) {
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
    const parsed = JSON.parse(base64UrlDecode(payload).toString("utf8")) as AdminTokenPayload;

    if (!parsed.sub || parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function findAdminByToken(token: string | undefined) {
  const payload = verifyAdminToken(token);

  if (!payload) {
    return null;
  }

  return prisma.admin.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });
}

export async function getAdminFromRequest(request?: NextRequest) {
  const token = request
    ? request.cookies.get(SESSION_COOKIE_NAME)?.value
    : (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  return findAdminByToken(token);
}

export async function getAdminSession() {
  return getAdminFromRequest();
}

export async function requireAdmin(request?: NextRequest) {
  return getAdminFromRequest(request);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export const createSessionToken = createAdminToken;
export const verifySessionToken = verifyAdminToken;
export const setSessionCookie = setAuthCookie;
export const clearSessionCookie = clearAuthCookie;
