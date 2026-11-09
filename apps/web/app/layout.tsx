import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VSN Email Planet — Operations overview",
  description: "A provider-neutral email operations control plane. Local prototype with synthetic data only.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
