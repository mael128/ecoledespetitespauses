import { NextResponse } from "next/server";
import { requireAdminToken } from "../../../../lib/require-admin-token";
import { getFile, putFile, putJsonFile } from "../../../../lib/github";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB, comfortably under Vercel's serverless body limit
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// slot format: "students:<id>" or "goods:<id>" — matches guidelines.json shape.
function applyPhoto(guidelines, slot, url) {
  const [group, id] = slot.split(":");
  if (group === "students") {
    const student = guidelines.students?.list?.find((s) => s.id === id);
    if (!student) throw new Error(`Élève inconnu : ${id}`);
    student.photo = url;
  } else if (group === "goods") {
    const item = guidelines.goods?.items?.find((g) => g.id === id);
    if (!item) throw new Error(`Article inconnu : ${id}`);
    item.photo = url;
  } else {
    throw new Error(`Emplacement photo inconnu : ${slot}`);
  }
  return guidelines;
}

export async function POST(request) {
  const { token, error } = requireAdminToken(request);
  if (error) return error;

  const form = await request.formData();
  const file = form.get("file");
  const slot = form.get("slot");

  if (!(file instanceof File) || !slot) {
    return NextResponse.json({ error: "Fichier ou emplacement manquant" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format d'image non supporté (jpg, png, webp, gif)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (4 Mo max)" }, { status: 400 });
  }

  const safeSlotName = String(slot).replace(/[^a-z0-9_-]/gi, "-");
  const path = `public/photos/${safeSlotName}.${ext}`;
  const url = `/photos/${safeSlotName}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await putFile(path, buffer, `Photo : ${safeSlotName}`, token);

    const current = await getFile("content/guidelines.json", token);
    const guidelines = current ? JSON.parse(current.content) : null;
    if (!guidelines) throw new Error("content/guidelines.json introuvable");
    applyPhoto(guidelines, slot, url);
    await putJsonFile("content/guidelines.json", guidelines, `Photo : lien mis à jour pour ${safeSlotName}`, token);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url });
}
