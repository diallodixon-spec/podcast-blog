import PostEditor from "./PostEditor";

export default async function Page({ params }) {
  const { id } = await params;

  return <PostEditor id={id} />;
}