import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { DateSummary } from "./_components/date-summary";
import { EntryForm } from "./_components/entry-form";
import { SalesEntryTable } from "./_components/sales-entry-table";

const SearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

interface PageProps {
  searchParams: unknown;
  params: {
    date: string;
  };
}

export default async function DatePage({ params, searchParams }: PageProps) {
  const { page, per_page } = SearchParamsSchema.parse(searchParams);
  const salesDay = await db.getSalesDay(params.date);
  const salesEntries = await db.getPagedSalesEntries(
    params.date,
    per_page,
    (page - 1) * per_page,
  );
  const pageCount = await db.getSalesEntriesPageCount(params.date, per_page);
  const stats = await db.getSalesEntriesStats(params.date);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>
          Caixa do dia {params.date.split("-").reverse().join("/")}
        </PageHeader>
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeftIcon className="mr-2 size-4" />
            Caixas
          </Link>
        </Button>
      </div>
      <Separator />
      {salesDay?.open === 1 && <EntryForm date={params.date} />}
      {stats && <DateSummary stats={stats} />}
      <SalesEntryTable
        data={salesEntries}
        pageCount={pageCount}
        salesDay={params.date}
        salesDayOpen={salesDay?.open === 1}
      />
    </PageContainer>
  );
}
