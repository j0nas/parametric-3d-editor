import type { Metadata } from "next";
import "./globals.css";

// Initialize product registry (side-effect import)
import "@/products";

export const metadata: Metadata = {
  title: "Parametric 3D Editor",
  description: "Configure and export parametric 3D models",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
