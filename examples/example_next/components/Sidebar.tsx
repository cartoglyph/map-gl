"use client";
import React from "react";
import { SidebarItem, LinkItem, HeadingItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type SidebarProps = {
  items: SidebarItem[];
};
const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <aside className="h-full overflow-auto border-r border-gray-300">
      <h1 className="border-b border-b-gray-300 px-2 py-4 text-lg">
        @dimapio/map-gl Examples
      </h1>
      {items.map((item) => {
        if (item.type === "link") {
          return <SidebarLink key={`${item.label}-${item.route}`} {...item} />;
        } else if (item.type === "heading") {
          return <SidebarHeading key={`${item.heading}`} {...item} />;
        }
        console.error(`Unmatched sidebar item`, item);
        return null;
      })}
    </aside>
  );
};

export default Sidebar;

const SidebarLink: React.FC<LinkItem> = ({ label, route }) => {
  const pathname = usePathname();
  const isSelected = pathname === route;
  return (
    <div
      className={clsx(
        `cursor-pointer text-sm  transition ease-in-out hover:text-gray-900`,
        isSelected ? `font-bold text-blue-500` : `text-gray-500`
      )}
    >
      <Link href={route} className="block w-full px-4 py-2">
        {label}
      </Link>
    </div>
  );
};

const SidebarHeading: React.FC<HeadingItem> = ({ heading }) => {
  return (
    <h2 className="px-4 py-2 text-sm font-bold text-gray-700">{heading}</h2>
  );
};
