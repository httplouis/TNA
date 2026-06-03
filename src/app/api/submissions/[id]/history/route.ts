import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
const supabase = createClient(supabaseUrl, serviceKey);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: submissionId } = await params;
    const { data, error } = await supabase
      .from("submission_history")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Supabase history GET error:", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
