import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-blue-600 text-blue-950 border-[1px] border-blue-300",
  "bg-green-700 text-green-950 border-[1px] border-green-300",
  "bg-yellow-700 text-yellow-950 border-[1px] border-yellow-300",
  "bg-red-900 text-red-950 border-[1px] border-red-300"
];

export const getColor = (color) => {
  if(color>=0 && color< colors.length) return colors[color];
  return colors[0];
}

