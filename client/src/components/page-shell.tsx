type Props = {
  title: string;
  children?: React.ReactNode;
};

export function PageShell({ title, children }: Props) {
  return (
    <section className="w-full min-w-0">
      <h1 className="mb-2 font-heading text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      {children}
    </section>
  );
}
