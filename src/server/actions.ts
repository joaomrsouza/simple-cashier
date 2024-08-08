"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { db } from "./db";

interface ActionResponse {
  message?: string;
  success: boolean;
}

export async function getSalesDay(date: string) {
  return await db.getSalesDay(date);
}

export async function insertSalesDay(
  date: string,
  open: 0 | 1 = 1,
): Promise<ActionResponse> {
  try {
    await db.insertSalesDay(date, open);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao abrir caixa! Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function insertSalesEntry(
  salesDay: string,
  value: number,
): Promise<ActionResponse> {
  try {
    await db.insertSalesEntry(salesDay, value);
    revalidatePath(`/${salesDay}`);
    return { success: true };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao inserir movimentação! Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function deleteSalesEntry(
  id: number,
  salesDay: string,
): Promise<ActionResponse> {
  try {
    await db.deleteSalesEntry(id);
    revalidatePath(`/${salesDay}`);
    return { success: true };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao deletar movimentação! Por favor, tente novamente.",
      success: false,
    };
  }
}

export async function setPass(pass: string) {
  const hashedPass = bcrypt.hashSync(pass, 10);
  await db.setSecret("admin-pass", hashedPass);
}

export async function checkPass(pass: string) {
  const hashedPass = await db.getSecret("admin-pass");
  if (!hashedPass) return false;

  return await bcrypt.compare(pass, hashedPass);
}
