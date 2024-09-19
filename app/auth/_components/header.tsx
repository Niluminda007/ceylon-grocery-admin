import Logo from "@/components/logo";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <Logo />
        <span className="block md:hidden text-sm font-medium">
          Ceylong Grocery
        </span>
      </div>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
};
