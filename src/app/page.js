import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, excerpt, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        Error loading posts
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0 }}>Nationwide Radio broadcast articles</h1>
        <p style={{ color: "#666", marginTop: 5 }}>
          Latest posts
        </p>
      </div>

      {/* POSTS GRID (like editor layout) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
        }}
      >
        {/* LEFT: POSTS */}
        <div>
          {posts?.map((post) => (
            <div
              key={post.id}
              style={{
                padding: 20,
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                marginBottom: 15,
                background: "#fff",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0" }}>
                {post.title}
              </h2>

              <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
                </p>

              <p style={{ color: "#555" }}>
                {post.excerpt}
              </p>

              <Link
                href={`/post/${post.id}`}
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>

        {/* RIGHT: INFO PANEL (same vibe as NER panel) */}
        <div
          style={{
            borderLeft: "1px solid #eee",
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              padding: 20,
              border: "1px solid #eee",
              borderRadius: 10,
              background: "#fafafa",
            }}
          >


            <p style={{ fontSize: 14, color: "#666" }}>
              Select a post to edit content.
            </p>

            <p style={{ fontSize: 13, color: "#999" }}>
              Total posts: {posts?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}