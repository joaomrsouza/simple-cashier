import { type Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  pageSizeOptions?: number[];
  selectableRows?: boolean;
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  pageSizeOptions = [10, 20, 30, 40, 50],
  selectableRows,
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {selectableRows && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </>
        )}
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">
            Linhas por página
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            aria-label="Ir para a primeira página"
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => table.previousPage()}
            aria-label="Ir para a página anterior"
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Ir para a próxima página"
          >
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="hidden size-8 lg:flex"
            disabled={!table.getCanNextPage()}
            aria-label="Ir para a última página"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            <ChevronsRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
