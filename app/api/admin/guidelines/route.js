import { NextResponse } from "next/server";
import { requireAdminToken } from "../../../../lib/require-admin-token";
import { getFile, putJsonFile } from "../../../../lib/github";

export async function GET(request) {
  const { token, error } = requireAdminToken(request);
  if (error) return error;

  try {
    const file = await getFile("content/guidelines.json", token);
    return NextResponse.json(file ? JSON.parse(file.content) : null);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { token, error } = requireAdminToken(request);
  if (error) return error;

  const body = await request.json();
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Contenu invalide" }, { status: 400 });
  }

  try {
    await putJsonFile("content/guidelines.json", body, "Charte de marque : mise à jour depuis l'admin", token);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
