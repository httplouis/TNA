import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, serviceKey);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("submissions").select("*").eq("id", id).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase GET by id error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patch = await req.json();
    const { data, error } = await supabase.from("submissions").update(patch).eq("id", id).select().single();
    if (error) throw error;

    if (data?.id) {
      const eventType = patch.status ? "status_updated" : patch.adminNotes ? "notes_updated" : "updated";
      const historyEvent = {
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        submission_id: data.id,
        event_type: eventType,
        event_details: patch,
      };
      const { error: historyError } = await supabase.from("submission_history").insert([historyEvent]);
      if (historyError) console.error("Supabase history insert error:", historyError);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase PATCH error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
