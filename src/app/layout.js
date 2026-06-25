export const metadata = {
  title: "Podcast Blog",
  description: "AI generated podcast blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}