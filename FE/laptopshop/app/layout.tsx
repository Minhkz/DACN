import "./globals.css";

export const metadata = {
  title: {
    default: "  Laptop E-commerce",
  },
  description: "Mô tả chung cho website",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
