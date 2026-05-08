import { cn } from "../lib/utils";

type Props = {
  error: string;
  className?: string;
};

export function ErrorRetryBlock({ error, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}
