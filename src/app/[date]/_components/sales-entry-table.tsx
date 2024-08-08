"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DataTable } from "@/components/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useDataTable } from "@/hooks/use-data-table";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import { deleteSalesEntry } from "@/server/actions";
import { type SalesEntry } from "@/server/db";
import { type ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface SalesEntryTableProps {
  data: SalesEntry[];
  pageCount: number;
  salesDay: string;
  salesDayOpen: boolean;
}

export function SalesEntryTable(props: SalesEntryTableProps) {
  const { data, pageCount, salesDay, salesDayOpen } = props;

  const columns = React.useMemo(
    () => getColumns(salesDay, salesDayOpen),
    [salesDay, salesDayOpen],
  );

  const { table } = useDataTable({
    columns,
    data,
    defaultPerPage: 10,
    defaultSort: "timestamp.desc",
    pageCount,
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}

function getColumns(
  salesDay: string,
  salesDayOpen: boolean,
): ColumnDef<SalesEntry>[] {
  return [
    {
      accessorKey: "timestamp",
      cell: ({ cell }) => (
        <div className="flex space-x-2">
          <span className="max-w-[31.25rem] truncate font-medium">
            {formatTimestamp(cell.getValue<string>())}
          </span>
        </div>
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Hora" column={column} />
      ),
    },
    {
      accessorKey: "value",
      cell: ({ cell }) => formatCurrency(cell.getValue<number>()),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Valor" column={column} />
      ),
    },
    {
      accessorKey: "value",
      cell: ({ cell }) =>
        cell.getValue<number>() > 0 ? (
          <Badge>Entrada</Badge>
        ) : (
          <Badge variant="destructive">Saída</Badge>
        ),
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Status" column={column} />
      ),
    },
    ...(salesDayOpen
      ? [
          {
            cell: function Cell({ row }) {
              const {
                close: handleDeleteDialogClose,
                isOpen: isDeleteDialogOpen,
                open: handleDeleteDialogOpen,
              } = useConfirmDialog();

              const handleDeleteDialogConfirm = React.useCallback(async () => {
                const response = await deleteSalesEntry(
                  row.original.id,
                  salesDay,
                );
                handleDeleteDialogClose();

                if (!response.success) {
                  response.message && toast.error(response.message);
                  return;
                }

                toast.success("Movimentação excluída com sucesso!");
              }, [handleDeleteDialogClose, row.original.id]);

              return (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleDeleteDialogOpen}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                  <ConfirmDialog
                    open={isDeleteDialogOpen}
                    onCancel={handleDeleteDialogClose}
                    onConfirm={handleDeleteDialogConfirm}
                  >
                    Você tem certeza que deseja excluir esta movimentação?{" "}
                    <span className="font-bold">
                      Está ação não pode ser desfeita.
                    </span>
                  </ConfirmDialog>
                </>
              );
            },
            id: "actions",
            maxSize: 30,
          } satisfies ColumnDef<SalesEntry>,
        ]
      : []),
  ];
}
