"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function FormActions() {
  const {
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <>
      <p className="text-sm font-medium text-destructive">
        {errors.root?.message}
      </p>

      <div className="flex flex-row-reverse">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
          ) : (
            <SaveIcon className="mr-2 size-4" />
          )}
          Salvar
        </Button>
      </div>
    </>
  );
}
