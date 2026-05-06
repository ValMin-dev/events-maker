import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";

export function AuthLoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
