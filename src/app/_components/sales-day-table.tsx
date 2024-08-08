"use client";

import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminLocker } from "@/hooks/use-admin-locker";
import { useDataTable } from "@/hooks/use-data-table";
import { formatCurrency, getToday } from "@/lib/utils";
import { type CompleteSalesDay } from "@/server/db";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SalesDayTableProps {
  data: CompleteSalesDay[];
  pageCount: number;
}

export function SalesDayTable(props: SalesDayTableProps) {
  const { data, pageCount } = props;

  const { locked } = useAdminLocker();

  const columns = React.useMemo(() => getColumns(locked), [locked]);

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "date.desc",
    pageCount,
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}

function getColumns(adminLocked: boolean): ColumnDef<CompleteSalesDay>[] {
  return [
    {
      accessorKey: "date",
      cell: ({ cell, row }) =>
        adminLocked && getToday() !== cell.getValue<string>() ? (
          cell.getValue<string>().split("-").reverse().join("/")
        ) : (
          <Button asChild size="xs" variant="link" className="p-0">
            <Link href={`./${row.original.date}`}>
              <div className="flex space-x-2">
                <span className="max-w-[31.25rem] truncate font-medium">
                  {cell.getValue<string>().split("-").reverse().join("/")}
                </span>
              </div>
            </Link>
          </Button>
        ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Data" column={column} />
      ),
    },
    {
      accessorKey: "entry_count",
      cell: ({ cell }) => String(cell.getValue<number>()),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qtd. de movimentações" />
      ),
    },
    {
      accessorKey: "income",
      cell: ({ cell }) => (
        <span className="flex">
          <ArrowUpIcon className="mr-2 size-4 text-emerald-700" />
          {adminLocked ? "******" : formatCurrency(cell.getValue<number>())}
        </span>
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entradas" />
      ),
    },
    {
      accessorKey: "outcome",
      cell: ({ cell }) => (
        <span className="flex">
          <ArrowDownIcon className="mr-2 size-4 text-destructive" />
          {adminLocked
            ? "******"
            : formatCurrency(cell.getValue<number>()).replace("-", "")}
        </span>
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Saídas" column={column} />
      ),
    },
    {
      accessorKey: "balance",
      cell: ({ cell }) =>
        adminLocked ? "******" : formatCurrency(cell.getValue<number>()),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Saldo" column={column} />
      ),
    },
    {
      accessorKey: "open",
      cell: ({ cell }) =>
        cell.getValue<number>() === 1 ? (
          <Badge>Caixa Aberto</Badge>
        ) : (
          <Badge variant="destructive">Caixa Fechado</Badge>
        ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Status" column={column} />
      ),
    },
  ];
}
