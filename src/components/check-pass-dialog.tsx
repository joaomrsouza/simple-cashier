"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "@/lib/zod";
import { checkPass } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "./form/form-input";
import { Form } from "./ui/form";

const CheckPassFormSchema = z.object({
  password: z.string().trim(),
});

type CheckPassFormData = z.infer<typeof CheckPassFormSchema>;

interface PassDialogProps {
  onCorrectPass: () => void;
  onOpenChange: (open: boolean) => void;
  onWrongPass: () => void;
  open: boolean;
}

export function CheckPassDialog(props: PassDialogProps) {
  const { onCorrectPass, onOpenChange, onWrongPass, open } = props;

  const form = useForm<CheckPassFormData>({
    defaultValues: { password: "" },
    resolver: zodResolver(CheckPassFormSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = form;

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  async function onSubmit(data: CheckPassFormData) {
    const valid = await checkPass(data.password);

    if (valid) onCorrectPass();
    else onWrongPass();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exibir os valores</DialogTitle>
          <DialogDescription>
            Digite a senha de administrador para exibir os valores.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Senha" name="password" type="password" />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckIcon className="mr-2 size-4" />
              )}
              Confirmar
            </Button>

            <p className="text-sm font-medium text-destructive">
              {errors.root?.message}
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
