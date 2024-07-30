"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";

export async function getSalesDay(date: string) {
  return await db.getSalesDay(date);
}

export async function insertSalesDay(
  date: string,
  open: 0 | 1 = 1,
): Promise<void> {
  await db.insertSalesDay(date, open);
  revalidatePath("/");
}

export async function insertSalesEntry(
  salesDay: string,
  value: number,
): Promise<void> {
  await db.insertSalesEntry(salesDay, value);
  revalidatePath(`/${salesDay}`);
}

export async function deleteSalesEntry(id: number, salesDay: string) {
  await db.deleteSalesEntry(id);
  revalidatePath(`/${salesDay}`);
}
