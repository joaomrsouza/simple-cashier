"use client";

import { FormCombobox } from "@/components/form/form-combobox";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "@/lib/zod";
import { insertSalesEntry } from "@/server/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const EntryFormSchema = z.object({
  type: z.enum(["in", "out"]),
  value: z
    .number({ message: "O valor deve ser um número" })
    .refine(value => value !== 0, {
      message: "O valor não pode ser 0",
    }),
});

type EntryFormData = z.infer<typeof EntryFormSchema>;

interface EntryFormProps {
  date: string;
}

export function EntryForm(props: EntryFormProps) {
  const { date } = props;

  const form = useForm<EntryFormData>({
    defaultValues: { type: "in" },
    resolver: zodResolver(EntryFormSchema),
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
  } = form;

  async function onSubmit(data: EntryFormData) {
    const response = await insertSalesEntry(
      date,
      data.value * (data.type === "in" ? 1 : -1),
    );

    if (!response.success) {
      response.message && toast.error(response.message);
      return;
    }

    form.reset();
    form.setFocus("value");
    toast.success("Movimentação salva com sucesso!");
  }

  return (
    <div className="container">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start gap-2">
            <FormInput<EntryFormData>
              step="0.01"
              name="value"
              label="Valor"
              type="number"
            />
            <FormCombobox<EntryFormData>
              name="type"
              label="Tipo"
              options={[
                { label: "Entrada", value: "in" },
                { label: "Saída", value: "out" },
              ]}
            />
            <div className="mt-9 flex flex-row-reverse">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                ) : (
                  <SaveIcon className="mr-2 size-4" />
                )}
                Salvar
              </Button>
            </div>
          </div>
          <p className="text-sm font-medium text-destructive">
            {errors.root?.message}
          </p>
        </form>
      </Form>
    </div>
  );
}
