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
import { checkPass, setPass } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "./form/form-input";
import { Form } from "./ui/form";

const SetPassFormSchema = z.object({
  oldPassword: z.string().trim(),
  password: z.string().trim().min(6),
});

type SetPassFormData = z.infer<typeof SetPassFormSchema>;

interface PassDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function SetPassDialog(props: PassDialogProps) {
  const { onOpenChange, open } = props;

  const form = useForm<SetPassFormData>({
    defaultValues: { oldPassword: "", password: "" },
    resolver: zodResolver(SetPassFormSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = form;

  React.useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  async function onSubmit(data: SetPassFormData) {
    try {
      const checkOldPass = await checkPass(data.oldPassword);
      if (!checkOldPass) {
        toast.warning("Senha atual incorreta!");
        return;
      }

      await setPass(data.password);
      onOpenChange(false);
    } catch {
      toast.error(
        "Ocorreu um erro ao atualizar a senha! Por favor, tente novamente.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar a senha</DialogTitle>
          <DialogDescription>
            Atualize a senha para o acesso de administrador.
            <br />A senha padrão é &apos;admin&apos;.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput<SetPassFormData>
              type="password"
              name="oldPassword"
              label="Senha atual"
            />
            <FormInput<SetPassFormData>
              type="password"
              name="password"
              label="Nova senha"
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              ) : (
                <SaveIcon className="mr-2 size-4" />
              )}
              Salvar
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
