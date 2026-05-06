type Props = {
  message: string | null | undefined;
};

export function AuthFormErrorAlert({ message }: Props) {
  if (!message) return null;

  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}
