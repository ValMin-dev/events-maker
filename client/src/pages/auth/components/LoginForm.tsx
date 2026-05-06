import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth-store";
import { AuthFormCard } from "./AuthFormCard";
import type { SubmitEvent } from "react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../../components/ui/field";
import { AuthFormErrorAlert } from "./AuthFormErrorAlert";
import { Button } from "../../../components/ui/button";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const authError = useAuthStore((s) => s.authError);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      return;
    }
    if (password.length < 5) {
      return;
    }
    if (email.length < 3) {
      return;
    }

    try {
      await login({ email, password });
      navigate("/events");
    } catch (error) {}
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard
        title="Welcome back"
        description="Enter your details to sign in."
      >
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={authError} />

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input type="email" name="email" id="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <input type="password" name="password" id="password" required />
            </Field>
            <Field>
              <Button type="submit" disabled={isAuthLoading} className="w-full">
                {isAuthLoading ? "Loading..." : "Sign in"}
              </Button>
              <FieldDescription className="text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 underline-offset-4 hover:underline"
                  onClick={() => {
                    useAuthStore.getState().clearOfError();
                  }}
                >
                  Register
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
