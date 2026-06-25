"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostEditor({ id }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [entities, setEntities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedHeadline, setCopiedHeadline] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);

      const res = await fetch(`/api/get-post?id=${id}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.post) {
        setTitle(data.post.title || "");
        setArticle(data.post.article || "");
        setEntities(data.post.entities || []);
      }

      setLoading(false);
    }

    fetchPost();
  }, [id]);

  async function copyHeadline() {
    await navigator.clipboard.writeText(title);
    setCopiedHeadline(true);
    setTimeout(() => setCopiedHeadline(false), 1500);
  }

  async function copyArticle() {
    await navigator.clipboard.writeText(article);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function savePost() {
    setSaving(true);

    let updatedArticle = article;

    const updatedEntities = entities.map((e) => {
      const original = e.found?.normalize("NFKC").replace(/ +/g, " ").trim();
      const corrected = e.suggested?.normalize("NFKC").replace(/ +/g, " ").trim();

      if (original && corrected && original !== corrected) {
        const normalizedArticle = updatedArticle
          .normalize("NFKC")
          .replace(/ +/g, " ");

        if (normalizedArticle.includes(original)) {
          updatedArticle = normalizedArticle.replaceAll(original, corrected);
        }

        return { ...e, found: corrected };
      }

      return e;
    });

    await fetch("/api/update-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        article: updatedArticle,
        entities: updatedEntities,
      }),
    });

    setArticle(updatedArticle);
    setEntities(updatedEntities);

    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ padding: 40, fontSize: 14, color: "#666" }}>
        Loading post...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 30,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* HEADER */}
      <div className="card">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          rows={2}
          style={{
            width: "100%",
            fontSize: 20,
            border: "none",
            outline: "none",
            fontWeight: 600,
            marginBottom: 10,
            resize: "none",
            overflow: "hidden",
            lineHeight: 1.4,
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          }}
        />

        {/* ✅ Copy Headline button */}
        <button onClick={copyHeadline}>
          {copiedHeadline ? "Copied!" : "Copy Headline"}
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ARTICLE */}
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>Article</h3>

          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            rows={26}
            style={{
              width: "100%",
              fontSize: 15,
              lineHeight: 1.6,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 6,
              resize: "vertical",
            }}
          />

          {/* ✅ BUTTONS MOVED HERE */}
          <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={savePost} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>

              <button onClick={copyArticle}>
                {copied ? "Copied!" : "Copy Article Text"}
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#555",
                fontSize: 14,
                padding: 0,
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* ENTITIES */}
        <div className="card">
          <h3>Review Names</h3>

          {entities.length === 0 ? (
            <p style={{ color: "#888" }}>No entities found</p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {entities.map((e, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    background: "#fafafa",
                  }}
                >
                  <div style={{ fontSize: 11, color: "#666" }}>Found</div>

                  <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
                    {e.found}
                  </div>

                  <div style={{ fontSize: 11, color: "#666" }}>Suggested</div>

                  <input
                    value={e.suggested || ""}
                    onChange={(ev) => {
                      const updated = [...entities];
                      updated[i].suggested = ev.target.value;
                      setEntities(updated);
                    }}
                    style={{
                      width: "100%",
                      padding: "6px",
                      fontSize: 13,
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      marginLeft: "-1px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {/* ✅ Save button below entities */}
          <div style={{ marginTop: 15 }}>
            <button onClick={savePost} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* CARD STYLE */}
      <style jsx>{`
        .card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        button {
          background: #111;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}