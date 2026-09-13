import { NextResponse } from "next/server";
import { requireAdminSession } from "../../../../lib/require-admin";
import { getFile, putJsonFile } from "../../../../lib/github";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const file = await getFile("content/devoirs.json");
    return NextResponse.json(file ? JSON.parse(file.content) : []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { session, error } = await requireAdminSession();
  if (error) return error;

  const body = await request.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "La liste des devoirs doit être un tableau" }, { status: 400 });
  }

  try {
    await putJsonFile(
      "content/devoirs.json",
      body,
      `Devoirs : mise à jour par ${session.user?.login || session.user?.name}`
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
