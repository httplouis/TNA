import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, serviceKey);

export async function GET() {
  try {
    const { data, error } = await supabase.from("submissions").select("*").order("submittedAt", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase GET error:", err);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const toInsert = { ...body };
    const { data, error } = await supabase.from("submissions").insert([toInsert]).select().single();
    if (error) throw error;

    if (data?.id) {
      const historyEvent = {
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        submission_id: data.id,
        event_type: "created",
        event_details: { status: data.status, submittedAt: data.submittedAt },
      };
      const { error: historyError } = await supabase.from("submission_history").insert([historyEvent]);
      if (historyError) console.error("Supabase history insert error:", historyError);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Supabase POST error:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
