import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Derives badge styles from a hex color stored on the project/category. */
export function getSpecialtyStyle(hexColor: string) {
  return {
    color: hexColor,
    bg: `${hexColor}28`, // ~16% opacity as hex alpha
  };
}

export function isNew(date: Date | string): boolean {
  const created = typeof date === "string" ? new Date(date) : date;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return created > sevenDaysAgo;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "…" : str;
}
