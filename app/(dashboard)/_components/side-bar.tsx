"use client";

import { Accordion } from "@/components/ui/accordion";
import { useLocalStorage } from "usehooks-ts";
import { routes } from "@/constants/nav-route";
import NavItem from "./nav-item";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

interface SidebarProps {
  storageKey?: string;
}
const SideBar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const onExpand = useCallback(
    (id: string) => {
      setExpanded((curr) => ({ ...curr, [id]: !expanded[id] }));
    },
    [expanded, setExpanded]
  );

  const path = usePathname();

  const isActiveRoute = (href: string) => path === href;

  return (
    <div className="h-full flex flex-col space-y-4 w-60 p-5 bg-white dark:bg-gray-900 shadow-lg">
      <Accordion type="multiple" className="space-y-4">
        {routes.map((route) => (
          <NavItem
            key={route.id}
            isActive={isActiveRoute(route.href || route.id)}
            isExpanded={expanded[route.id]}
            navRoute={route}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default SideBar;
