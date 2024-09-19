import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Header } from "./header";

interface AuthCardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  className?: string;
}

export const AuthCardWrapper = ({
  children,
  headerLabel,
  className,
}: AuthCardWrapperProps) => {
  return (
    <Card className={`w-[400px] shadow-md ${className}`}>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
