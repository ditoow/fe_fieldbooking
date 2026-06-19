import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBookingNumber(bookingNumber: string): string {
  return bookingNumber.split('-').slice(0, 2).join('-');
}
