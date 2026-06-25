import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const { title, article } = body;

    if (!title || !article) {
      return Response.json(
        { error: "Missing title or article" },
        { status: 400 }
      );
    }

    // simple excerpt generator
    const excerpt = article.slice(0, 180) + "...";

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          article,
          excerpt,
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ post: data });
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}