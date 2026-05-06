import { cn } from "../../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function AuthLayout({ children, className }: Props) {
  return (
    <div
      className={cn(
        "bg-background flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
