import { type Column } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  className,
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            aria-label={
              column.getIsSorted() === "desc"
                ? "Ordem decrescente. Clique para ordem crescente."
                : column.getIsSorted() === "asc"
                  ? "Ordem crescente. Clique para ordem decrescente."
                  : "Não ordenado. Clique para ordem crescente."
            }
          >
            <span>{title}</span>
            {column.getCanSort() && column.getIsSorted() === "desc" ? (
              <ArrowDownIcon aria-hidden="true" className="ml-2 size-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon aria-hidden="true" className="ml-2 size-4" />
            ) : (
              <ChevronsUpDownIcon aria-hidden="true" className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Ordem crescente"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  aria-hidden="true"
                  className="mr-2 size-3.5 text-muted-foreground/70"
                />
                Crescente
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Ordem decrescente"
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  aria-hidden="true"
                  className="mr-2 size-3.5 text-muted-foreground/70"
                />
                Decrescente
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Esconder coluna"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOffIcon
                aria-hidden="true"
                className="mr-2 size-3.5 text-muted-foreground/70"
              />
              Esconder
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
