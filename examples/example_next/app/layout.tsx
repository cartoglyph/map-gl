import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SIDEBAR_ITEMS } from "@/types";

export const metadata: Metadata = {
  title: "@cartoglyph/map-gl",
  description: "mapbox-gl library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="absolute grid h-screen w-screen grid-cols-[400px_repeat(3,_minmax(0,_1fr))] overflow-hidden">
        <div className="col-span-1">
          <Sidebar items={SIDEBAR_ITEMS} />
        </div>
        <div className="col-span-3">{children}</div>
      </body>
    </html>
  );
}
