"use client";

import { Button } from "@/components/ui/button";
import { getToday } from "@/lib/utils";
import { getSalesDay, insertSalesDay } from "@/server/actions";
import { DollarSignIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function OpenCashierButton() {
  const router = useRouter();

  async function handleOpenCashier() {
    const today = getToday();

    const salesDay = await getSalesDay(today);

    if (!salesDay) {
      try {
        await insertSalesDay(today);
      } catch (error) {
        toast.error("Erro ao abrir o caixa! Por favor, tente novamente.");
        return;
      }
    }

    router.push(`/${today}`);
  }

  return (
    <Button onClick={handleOpenCashier}>
      <DollarSignIcon className="mr-2 size-4" />
      Abrir Caixa de Hoje
    </Button>
  );
}
