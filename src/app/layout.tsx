import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-commerce",
  description: "E-commerce frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
