import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToday() {
  return new Date().toLocaleDateString().split("/").reverse().join("-");
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  date.setHours(date.getHours() - 3);
  return date.toLocaleTimeString();
}
