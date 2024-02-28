import React from "react";
import { ExampleItem } from "@/types";
import Link from "next/link";

type SidebarProps = {
  examples: ExampleItem[];
};
const Sidebar: React.FC<SidebarProps> = ({ examples }) => {
  return (
    <aside className="h-full overflow-auto border-r border-gray-300">
      <h1 className="border-b border-b-gray-300 px-2 py-4 text-lg">
        @dimapio/map-gl Examples
      </h1>
      {examples.map((example) => (
        <Example key={example.href} {...example} />
      ))}
    </aside>
  );
};

export default Sidebar;

const Example: React.FC<ExampleItem> = ({ label, href }) => {
  return (
    <div className="cursor-pointer text-sm text-gray-600 transition ease-in-out hover:bg-gray-100 hover:text-gray-900">
      <Link href={href} className="block w-full px-4 py-2">
        {label}
      </Link>
    </div>
  );
};
