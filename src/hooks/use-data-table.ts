"use client";

import { z } from "@/lib/zod";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { fns } from "@/lib/date-fns";
import { isDateRange } from "react-day-picker";

export interface Option {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  options?: Option[];
  placeholder?: string;
  type: "date" | "select" | "text";
  value: keyof TData;
}

export interface DataTableFilterOption<TData> {
  filterOperator?: string;
  filterValues?: string[];
  id: string;
  isMulti?: boolean;
  label: string;
  options: Option[];
  value: keyof TData;
}

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPerPage?: number;
  defaultSort?: `${Extract<keyof TData, number | string>}.${"asc" | "desc"}`;
  enableAdvancedFilter?: boolean;
  filterFields?: DataTableFilterField<TData>[];
  pageCount: number;
}

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export function useDataTable<TData, TValue>({
  columns,
  data,
  defaultPerPage = 10,
  defaultSort,
  enableAdvancedFilter = false,
  filterFields = [],
  pageCount,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const perPage = search.per_page ?? defaultPerPage;
  const sort = search.sort ?? defaultSort;
  const [column, order] = sort?.split(".") ?? [];

  // Memoize computation of searchableColumns and filterableColumns
  const { dataRangeColumns, filterableColumns, searchableColumns } =
    React.useMemo(() => {
      return {
        dataRangeColumns: filterFields.filter(field => field.type === "date"),
        filterableColumns: filterFields.filter(
          field => field.type === "select" && field.options,
        ),
        searchableColumns: filterFields.filter(field => field.type === "text"),
      };
    }, [filterFields]);

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, number | string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const dataRangeColumn = dataRangeColumns.find(
          column => column.value === key,
        );
        const filterableColumn = filterableColumns.find(
          column => column.value === key,
        );
        const searchableColumn = searchableColumns.find(
          column => column.value === key,
        );

        if (dataRangeColumn) {
          filters.push({
            id: key,
            value: value,
          });
        } else if (filterableColumn) {
          filters.push({
            id: key,
            value: value.split("."),
          });
        } else if (searchableColumn) {
          filters.push({
            id: key,
            value: [value],
          });
        }

        return filters;
      },
      [],
    );
  }, [dataRangeColumns, filterableColumns, searchableColumns, searchParams]);

  // Table states
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: perPage,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      desc: order === "desc",
      id: column ?? "",
    },
  ]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
          : null,
      })}`,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  // Handle server-side filtering
  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter(filter => {
          return searchableColumns.find(column => column.value === filter.id);
        }),
      ),
      500,
    ),
  ) as ColumnFiltersState;

  const filterableColumnFilters = columnFilters.filter(filter => {
    return filterableColumns.find(column => column.value === filter.id);
  });

  const dataRangeColumnFilters = columnFilters.filter(filter => {
    return dataRangeColumns.find(column => column.value === filter.id);
  });

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Opt out when advanced filter is enabled, because it contains additional params
    if (enableAdvancedFilter) return;

    // Prevent resetting the page on initial render
    if (!mounted) {
      setMounted(true);
      return;
    }

    // Initialize new params
    const newParamsObject = {
      page: 1,
    };

    // Handle debounced searchable column filters
    for (const column of debouncedSearchableColumnFilters) {
      if (typeof column.value === "string") {
        Object.assign(newParamsObject, {
          [column.id]: typeof column.value === "string" ? column.value : null,
        });
      }
    }

    // Handle filterable column filters
    for (const column of filterableColumnFilters) {
      if (typeof column.value === "object" && Array.isArray(column.value)) {
        Object.assign(newParamsObject, { [column.id]: column.value.join(".") });
      }
    }

    // Handle data range column filters
    for (const column of dataRangeColumnFilters) {
      if (typeof column.value === "object" && isDateRange(column.value)) {
        Object.assign(newParamsObject, {
          [column.id]:
            [
              column.value.from && fns.format(column.value.from, "yyyy-MM-dd"),
              column.value.to && fns.format(column.value.to, "yyyy-MM-dd"),
            ]
              .filter(Boolean)
              .join(".") ?? null,
        });
      }
    }

    // Remove deleted values
    for (const key of searchParams.keys()) {
      if (
        (searchableColumns.find(column => column.value === key) &&
          !debouncedSearchableColumnFilters.find(
            column => column.id === key,
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          )) ||
        (filterableColumns.find(column => column.value === key) &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !filterableColumnFilters.find(column => column.id === key)) ||
        (dataRangeColumns.find(column => column.value === key) &&
          !dataRangeColumnFilters.find(column => column.id === key))
      ) {
        Object.assign(newParamsObject, { [key]: null });
      }
    }

    // After cumulating all the changes, push new params
    router.push(`${pathname}?${createQueryString(newParamsObject)}`);

    table.setPageIndex(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(dataRangeColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(debouncedSearchableColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filterableColumnFilters),
  ]);

  const table = useReactTable({
    columns,
    data,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    pageCount: pageCount ?? -1,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return { table };
}
