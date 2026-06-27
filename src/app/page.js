export const revalidate = 0

import { supabase } from "@/lib/supabase";
import PostList from "@/components/PostList";

const PAGE_SIZE = 15;

export default async function Home({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1");
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: posts, error, count } = await supabase
    .from("posts")
    .select("id, title, excerpt, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return <div style={{ padding: 40 }}>Error loading posts</div>;
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0 }}>Nationwide Radio broadcast articles</h1>
        <p style={{ color: "#666", marginTop: 5 }}>Latest posts</p>
      </div>

      <PostList posts={posts} page={page} totalPages={totalPages} count={count} />
    </div>
  );
}