import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const files = form.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ ok: false, error: "no files" }, { status: 400 });
  }

  const fd = new FormData();
  files.forEach((f) => fd.append("files", f, (f as File).name));

  const base = process.env.OCR_API_BASE || "http://localhost:8000";
  const res = await fetch(`${base}/ingest`, { method: "POST", body: fd });
  const data = await res.json();

  // 클라이언트에서 sessionStorage에 쓰도록 전달용 필드 포함
  return NextResponse.json({
    ok: true,
    items: data.items ?? [],
    __clientSessionKey: "last_ingest_items",
  });
}
