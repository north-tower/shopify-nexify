
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add formatCurrency helper for formatting currency in KSh (Kenyan Shilling)
export function formatCurrency(amount: number) {
  return `KSh ${amount.toLocaleString()}`;
}

