import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBackendUrl = () => {
  const url = process.env.BACKEND_URL;

  if (!url || url.length === 0) {
    throw new Error('BACKEND_URL not defined');
  }
  return url;
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
