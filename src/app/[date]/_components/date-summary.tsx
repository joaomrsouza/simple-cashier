"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminLocker } from "@/hooks/use-admin-locker";
import { formatCurrency } from "@/lib/utils";
import { type SalesEntryStats } from "@/server/db";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";

interface DateSummaryProps {
  stats: SalesEntryStats;
}

export function DateSummary(props: DateSummaryProps) {
  const { balance, count, income, outcome } = props.stats;

  const { locked } = useAdminLocker();

  return (
    <div className="flex gap-2">
      <SummaryCard title="Movimentações">{count}</SummaryCard>
      <SummaryCard title="Entradas">
        <ArrowUpIcon className="mr-2 size-4 text-emerald-700" />
        {locked ? "******" : formatCurrency(income)}
      </SummaryCard>
      <SummaryCard title="Saídas">
        <ArrowDownIcon className="mr-2 size-4 text-destructive" />
        {locked ? "******" : formatCurrency(outcome).replace("-", "")}
      </SummaryCard>
      <SummaryCard title="Saldo">
        {locked ? "******" : formatCurrency(balance)}
      </SummaryCard>
    </div>
  );
}

interface SummaryCardProps {
  children: React.ReactNode;
  title: string;
}

function SummaryCard(props: SummaryCardProps) {
  const { children, title } = props;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex">{children}</CardTitle>
      </CardHeader>
    </Card>
  );
}
