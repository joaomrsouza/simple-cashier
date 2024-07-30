"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AsteriskIcon } from "lucide-react";
import React from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormInputProps<TFieldValues extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  description?: React.ReactNode;
  label: React.ReactNode;
  name: FieldPath<TFieldValues>;
}
export function FormInput<TFieldValues extends FieldValues>({
  className,
  description,
  disabled,
  label,
  name,
  required,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  // Function like register({ valueAsNumber: true })
  const handleChange = React.useCallback(
    (onChange: ControllerRenderProps<TFieldValues>["onChange"]) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(
          e.target.value === ""
            ? null
            : inputProps.type === "number"
              ? Number(e.target.value)
              : e.target.value,
        );
      },
    [inputProps.type],
  );

  return (
    <FormField
      name={name}
      control={control}
      disabled={disabled}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem className={cn("my-4 w-full", className)}>
          <FormLabel className="flex gap-1">
            {label}
            {required && <AsteriskIcon className="size-4 text-destructive" />}
          </FormLabel>
          <FormControl>
            <Input
              {...inputProps}
              {...field}
              value={value ?? ""}
              onChange={handleChange(onChange)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
