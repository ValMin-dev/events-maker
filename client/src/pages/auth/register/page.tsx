import { AuthLayout } from "../components/AuthLayout";
import { RegisterForm } from "../components/RegisterForm";

export function AuthRegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
