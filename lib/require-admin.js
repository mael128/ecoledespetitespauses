import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

// Every admin API route must call this first. signIn/session callbacks in
// lib/auth.js already restrict who can hold a session at all, so a valid
// session here is sufficient proof of admin identity.
export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  }
  return { session, error: null };
}
