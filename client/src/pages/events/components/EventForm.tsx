import { Link, useNavigate } from "react-router-dom";
import type { CreateEventRequest } from "../../../shared/api/types";
import { useState } from "react";
import { cn, DATETIME_LOCAL_INPUT_FORMAT } from "../../../lib/utils";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Field, FieldGroup, FieldLabel } from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Slider } from "../../../components/ui/slider";
import { formatISO, isValid, parse } from "date-fns";

type EventFormValues = CreateEventRequest;

type Props = {
  title: string;
  className?: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  cancelTo?: string;
  submitLabel?: string;
  submittingLabel?: string;
  inputValues?: EventFormValues;
  error?: string | null;
  isLoading?: boolean;
  onSubmit: (values: EventFormValues) => Promise<void>;
};

export function EventForm({
  className,
  title,
  subtitle,
  backTo = "/events",
  backLabel,
  cancelTo = "/events",
  submitLabel,
  submittingLabel,
  inputValues,
  error,
  isLoading,
  onSubmit,
}: Props) {
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(inputValues?.capacity || 50);
  const [clientError, setClientError] = useState<string | null>(null);
  const topError = clientError || error;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const startedAtRaw = String(formData.get("startedAt") || "").trim();
    const capacity = Number(formData.get("capacity") || 50);
    const startedAtRawParsed = parse(
      startedAtRaw,
      DATETIME_LOCAL_INPUT_FORMAT,
      new Date(),
    );

    const startedAt = isValid(startedAtRawParsed)
      ? formatISO(startedAtRawParsed)
      : null;

    if (!startedAt) {
      setClientError("Please provide a valid start date and time.");
      return;
    }

    await onSubmit({
      title,
      description,
      address,
      startedAt,
      capacity,
    });
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl space-y-6", className)}>
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to={backTo}>
            <ArrowLeft className="mr-2 size-4" />
            {backLabel || "Back"}
          </Link>
        </Button>
        <h1 className="text-2xl font-heading font-semibold">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <CardContent className="space-y-4 pt-6">
            {topError ? (
              <p className="text-sm text-red-500">{topError}</p>
            ) : null}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="capacity">Название</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  defaultValue={inputValues?.title}
                  placeholder="до 200 символов"
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Описание</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={inputValues?.description}
                  placeholder="Краткое описание события, до 1000 символов"
                  rows={6}
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Адресс</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  defaultValue={inputValues?.address}
                  placeholder="Адрес проведения события, до 200 символов"
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="startedAt">Дата проведения</FieldLabel>
                <Input
                  id="startedAt"
                  name="startedAt"
                  type="datetime-local"
                  defaultValue={
                    inputValues?.startedAt
                      ? new Date(inputValues.startedAt)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  placeholder="Дата и время проведения события"
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel
                    className="inline-flex items-center text-transparent"
                    htmlFor="capacity-slider"
                  >
                    Вместимость
                  </FieldLabel>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {capacity}
                  </span>
                </div>
                <Slider
                  id="capacity-slider"
                  disabled={isLoading}
                  value={[capacity]}
                  onValueChange={(value) => setCapacity(value[0])}
                  min={1}
                  max={300}
                  step={1}
                />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-4 pt-0">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate(cancelTo)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading
                ? submittingLabel || "Submitting..."
                : submitLabel || "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
