import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { z } from "@/lib/zod";
import { db } from "@/server/db";
import { OpenCashierButton } from "./_components/open-chashier-button";
import { SalesDayTable } from "./sales-day-table";

const SearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

interface PageProps {
  searchParams: unknown;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { page, per_page } = SearchParamsSchema.parse(searchParams);
  const data = await db.getPagedCompleteSalesDay(
    per_page,
    (page - 1) * per_page,
  );
  const pageCount = await db.getSalesDayPageCount(per_page);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader>Caixas Diários</PageHeader>
        <OpenCashierButton />
      </div>
      <Separator />
      <SalesDayTable data={data} pageCount={pageCount} />
    </PageContainer>
  );
}
