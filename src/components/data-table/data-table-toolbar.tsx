"use client";

import type { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import * as React from "react";

import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type DataTableFilterField } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "../ui/date-range-picker";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  filterFields?: DataTableFilterField<TData>[];
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  children,
  className,
  filterFields = [],
  table,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { dateRangeColumns, filterableColumns, searchableColumns } =
    React.useMemo(() => {
      return {
        dateRangeColumns: filterFields.filter(field => field.type === "date"),
        filterableColumns: filterFields.filter(
          field => field.type === "select" && field.options,
        ),
        searchableColumns: filterFields.filter(field => field.type === "text"),
      };
    }, [filterFields]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            column =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <Input
                  key={String(column.value)}
                  className="h-8 w-40 lg:w-64"
                  placeholder={column.placeholder}
                  value={
                    (table
                      .getColumn(String(column.value))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={event =>
                    table
                      .getColumn(String(column.value))
                      ?.setFilterValue(event.target.value)
                  }
                />
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            column =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DataTableFacetedFilter
                  title={column.label}
                  key={String(column.value)}
                  options={column.options ?? []}
                  column={table.getColumn(
                    column.value ? String(column.value) : "",
                  )}
                />
              ),
          )}
        {dateRangeColumns.length > 0 &&
          dateRangeColumns.map(
            column =>
              table.getColumn(column.value ? String(column.value) : "") && (
                <DateRangePicker
                  className="h-8 w-60"
                  key={String(column.value)}
                  placeholder={column.placeholder}
                  onChange={range =>
                    table.getColumn(String(column.value))?.setFilterValue(range)
                  }
                  value={
                    (table
                      .getColumn(String(column.value))
                      ?.getFilterValue() as DateRange) ?? ""
                  }
                />
              ),
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            aria-label="Limpar filtros"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Limpar
            <XIcon aria-hidden="true" className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
