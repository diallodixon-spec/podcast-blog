import { supabase } from "@/lib/supabase";

const SECRET = process.env.INGESTION_SECRET;

export async function POST(req) {
  try {
    // AUTH
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    if (token !== SECRET) {
      return Response.json({ error: "Invalid token" }, { status: 403 });
    }

    // BODY
    const { title, article } = await req.json();

    if (!title || !article) {
      return Response.json(
        { error: "Missing title or article" },
        { status: 400 }
      );
    }

    // EXCERPT
    const excerpt =
      article.split(".").slice(0, 2).join(".").trim() + ".";

    // INSERT
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, article, excerpt }])
      .select()
      .single();

    if (error) throw error;

    return Response.json({ post: data });

  } catch (err) {
    console.error(err);

    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}