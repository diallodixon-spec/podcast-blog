import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { extractEntities } from "@/lib/ner";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ CASE 1: already has entities
  if (post.entities && post.entities.length > 0) {
    return NextResponse.json({ post });
  }

  // ❗ CASE 2: run YOUR real NER pipeline
  const entities = await extractEntities(post.article);

  // persist
  await supabase
    .from("posts")
    .update({ entities })
    .eq("id", id);

  post.entities = entities;

  return NextResponse.json({ post });
}