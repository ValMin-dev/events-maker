import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/auth-store";
import { use, useState } from "react";
import type { SubmitEvent } from "react";
import { AuthFormCard } from "./AuthFormCard";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../../components/ui/field";
import { AuthFormErrorAlert } from "./AuthFormErrorAlert";
import { Button } from "../../../components/ui/button";

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const authError = useAuthStore((s) => s.authError);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);

  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const passwordConfirm = formData.get("passwordConfirm")?.toString() ?? "";

    if (password !== passwordConfirm) {
      setClientError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setClientError("Password must be at least 6 characters");
      return;
    }
    if (name.length < 2) {
      setClientError("Name must be at least 2 characters");
      return;
    }
    try {
      await register({ name, email, password });
      navigate("/events");
    } catch (error) {
      setClientError("An unexpected error occurred");
    }
  };

  const topError = clientError ?? authError;
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard
        title="Create an account"
        description="Enter your details to create your account."
      >
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={topError} />
            <Field>
              <FieldLabel htmlFor="register-name">Name</FieldLabel>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password-confirm">
                Confirm Password
              </FieldLabel>
              <input
                id="register-password-confirm"
                type="password"
                name="passwordConfirm"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <Button type="submit" disabled={isAuthLoading} className="w-full">
                {isAuthLoading ? "Loading..." : "Register account"}
              </Button>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 underline-offset-4 hover:underline"
                  onClick={() => {
                    useAuthStore.getState().clearOfError();
                    setClientError(null);
                  }}
                >
                  Log in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
