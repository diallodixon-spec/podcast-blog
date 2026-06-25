import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const { id, title, article, entities } = body;

    if (!id) {
      return Response.json(
        { error: "Missing post id" },
        { status: 400 }
      );
    }

    const updateData = {
        title,
        article,
        entities,
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (article !== undefined) {
      updateData.article = article;

      // regenerate excerpt automatically
      updateData.excerpt =
        article.length > 200
          ? article.substring(0, 200) + "..."
          : article;
    }

    if (entities !== undefined) {
        updateData.entities = entities;
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      post: data,
    });

  } catch (err) {
    console.error("UPDATE POST ERROR:", err);

    return Response.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}