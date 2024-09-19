"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavRoute } from "@/types/nav-route";

interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  navRoute: NavRoute;
  onExpand: (id: string) => void;
}
const NavItem = ({ isActive, navRoute, onExpand }: NavItemProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const onClick = (route: NavRoute) => {
    if (route.href) {
      router.push(route.href);
    }
  };

  if (navRoute.children && navRoute.children.length > 0) {
    return (
      <AccordionItem value={navRoute.id} className="border-none">
        <AccordionTrigger
          onClick={() => onExpand(navRoute.id)}
          className={cn(
            "flex items-center gap-x-3 p-3 rounded-lg text-gray-900 dark:text-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
            isActive && "bg-neutral-900 text-white dark:bg-neutral-900"
          )}
        >
          <div className="flex items-center gap-x-4">
            <div className={cn("text-gray-600", isActive && "text-white")}>
              {navRoute.icon}
            </div>
            <span className="font-semibold text-base tracking-wide">
              {navRoute.label}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pl-6 text-gray-700 dark:text-gray-300">
          {navRoute.children.map((route) => {
            const isActiveRoute =
              (route.href && pathName.startsWith(route.href)) ||
              (route.children &&
                route.children
                  .filter((child) => child.href !== undefined)
                  .some(
                    (childRef) =>
                      childRef.href && pathName.startsWith(childRef.href)
                  ));

            return (
              <Button
                key={route.id}
                size="lg"
                onClick={() => onClick(route)}
                className={cn(
                  "w-full font-medium justify-start py-2 pl-10 text-sm rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActiveRoute && "bg-neutral-800 text-white"
                )}
                variant="ghost"
              >
                {route.icon}
                {route.label}
              </Button>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Button
      key={navRoute.id}
      size="lg"
      onClick={() => onClick(navRoute)}
      className={cn(
        "w-full font-semibold text-base justify-start p-3 text-gray-900 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-sm",
        isActive && "bg-neutral-800 text-white dark:bg-neutral-800"
      )}
      variant="ghost"
    >
      <div className="flex items-center gap-x-4">
        <div
          className={cn(
            "text-gray-600 hover:text-gray-600",
            isActive && "text-neutral-300"
          )}
        >
          {navRoute.icon}
        </div>
        <span>{navRoute.label}</span>
      </div>
    </Button>
  );
};

export default NavItem;

NavItem.Skeleton = function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-3">
      <div className="w-12 h-12 relative shrink-0">
        <Skeleton className="h-full w-full absolute rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};
