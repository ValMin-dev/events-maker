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
      setClientError("Паролі не збігаються");
      return;
    }
    if (password.length < 6) {
      setClientError("Пароль має містити щонайменше 6 символів");
      return;
    }
    if (name.length < 2) {
      setClientError("Ім'я має містити щонайменше 2 символи");
      return;
    }
    try {
      await register({ name, email, password });
      navigate("/events");
    } catch (error) {
      setClientError("Сталася неочікувана помилка");
    }
  };

  const topError = clientError ?? authError;
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AuthFormCard
        title="Створити акаунт"
        description="Введіть свої дані, щоб створити акаунт."
      >
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormErrorAlert message={topError} />
            <Field>
              <FieldLabel htmlFor="register-name">Ім'я</FieldLabel>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Ім'я"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-email">Електронна пошта</FieldLabel>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Електронна пошта"
                autoComplete="email"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password">Пароль</FieldLabel>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Пароль"
                autoComplete="new-password"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="register-password-confirm">
                Підтвердіть пароль
              </FieldLabel>
              <input
                id="register-password-confirm"
                type="password"
                name="passwordConfirm"
                placeholder="Підтвердіть пароль"
                autoComplete="new-password"
                required
                minLength={2}
                maxLength={100}
                disabled={isAuthLoading}
              />
            </Field>
            <Field>
              <Button
                type="submit"
                disabled={isAuthLoading}
                className="w-full cursor-pointer"
              >
                {isAuthLoading ? "Завантаження..." : "Зареєструватися"}
              </Button>
              <FieldDescription className="text-center">
                Вже маєте акаунт?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 underline-offset-4 hover:underline"
                  onClick={() => {
                    useAuthStore.getState().clearOfError();
                    setClientError(null);
                  }}
                >
                  Увійти
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </AuthFormCard>
    </div>
  );
}
