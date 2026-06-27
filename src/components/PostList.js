"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostList({ posts, page, totalPages, count }) {
  // When returning from a post, restore the saved page
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage && window.location.search === "") {
      sessionStorage.removeItem("currentPage");
      window.location.replace(`/?page=${savedPage}`);
    }
  }, []);

  function handlePostClick(e, postId) {
    sessionStorage.setItem("currentPage", page);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
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
            <h2 style={{ margin: "0 0 10px 0" }}>{post.title}</h2>

            <p style={{ fontSize: 12, color: "#999", marginTop: 6 }}>
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p style={{ color: "#555" }}>{post.excerpt}</p>

            <Link
              href={`/post/${post.id}`}
              onClick={(e) => handlePostClick(e, post.id)}
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

        {/* PAGINATION */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}`}
              style={{
                padding: "8px 16px",
                border: "1px solid #e5e5e5",
                borderRadius: 6,
                textDecoration: "none",
                color: "#111",
                fontWeight: 500,
              }}
            >
              ← Prev
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?page=${p}`}
              style={{
                padding: "8px 14px",
                border: "1px solid #e5e5e5",
                borderRadius: 6,
                textDecoration: "none",
                color: p === page ? "#fff" : "#111",
                background: p === page ? "#111" : "#fff",
                fontWeight: 500,
              }}
            >
              {p}
            </Link>
          ))}

          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}`}
              style={{
                padding: "8px 16px",
                border: "1px solid #e5e5e5",
                borderRadius: 6,
                textDecoration: "none",
                color: "#111",
                fontWeight: 500,
              }}
            >
              Next →
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT: INFO PANEL */}
      <div style={{ borderLeft: "1px solid #eee", paddingLeft: 20 }}>
        <div
          style={{
            padding: 20,
            border: "1px solid #eee",
            borderRadius: 10,
            background: "#fafafa",
          }}
        >
          <p style={{ fontSize: 14, color: "#666" }}>Select a post to edit content.</p>
          <p style={{ fontSize: 13, color: "#999" }}>
            Page {page} of {totalPages} · {count} total posts
          </p>
        </div>
      </div>
    </div>
  );
}