export interface NavRoute {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: NavRoute[];
  tooltip?: string;
}
