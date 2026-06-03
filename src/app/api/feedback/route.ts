import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, serviceKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json((data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      createdAt: row.created_at,
    })));
  } catch (err) {
    console.error("Supabase feedback GET error:", err);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const message = (body.message ?? "").toString().trim();

    if (!message) {
      return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
    }

    const newEntry = {
      id: randomUUID(),
      name: name || "Anonymous",
      email: email || null,
      message,
      created_at: new Date().toISOString(),
    } as any;

    const { data, error } = await supabase.from("feedback").insert([newEntry]).select().single();
    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error("Supabase feedback POST error:", err);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
