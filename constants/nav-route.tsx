import {
  LayoutDashboardIcon,
  BoxIcon,
  PackageIcon,
  GridIcon,
  ShoppingCartIcon,
  ReceiptIcon,
  UsersIcon,
  Settings2Icon,
} from "lucide-react";
import { NavRoute } from "@/types/nav-route";

export const routes: NavRoute[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: <LayoutDashboardIcon className="h-4 w-4 mr-2" />,
    tooltip: "Go to dashboard",
  },
  {
    id: "catalog",
    label: "Catalog",
    icon: <BoxIcon className="h-4 w-4 mr-2" />,
    children: [
      {
        id: "products",
        label: "Products",
        href: "/catalog/products",
        icon: <PackageIcon className="h-4 w-4 mr-2" />,
        tooltip: "Manage products",
      },
      {
        id: "categories",
        label: "Categories",
        href: "/catalog/categories",
        icon: <GridIcon className="h-4 w-4 mr-2" />,
        tooltip: "Manage categories",
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: <ShoppingCartIcon className="h-4 w-4 mr-2" />,
    children: [
      {
        id: "orders",
        label: "Orders",
        href: "/sales/orders",
        icon: <ReceiptIcon className="h-4 w-4 mr-2" />,
        tooltip: "View orders",
      },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: <UsersIcon className="h-4 w-4 mr-2" />,
    href: "/customers",
    tooltip: "Manage customers",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings2Icon className="h-4 w-4 mr-2" />,
    href: "/settings",
    tooltip: "Admin settings",
  },
];
