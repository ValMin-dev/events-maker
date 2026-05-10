type Props = {
  label: string;
  value: number;
  className?: string;
};

export const MyEventsStatTitle = ({ label, value, className }: Props) => {
  return (
    <div className={`rounded-lg border bg-muted/30 px-4 py-3 ${className}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
};
