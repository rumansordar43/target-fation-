import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return `৳${price.toLocaleString()}`;
};

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh"
];

export const CATEGORIES = [
  "Solid Drop Shoulder",
  "Oversized Graphic Tee",
  "Embroidered Design Tee",
  "Polo T-Shirt",
  "Full Sleeve T-Shirt"
];

export const SIZES = ["S", "M", "L", "XL", "XXL"];
