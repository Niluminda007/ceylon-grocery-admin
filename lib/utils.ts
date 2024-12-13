import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Decimal } from "decimal.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSKU = (productName: string, categoryId: string) => {
  const prefix = categoryId.substring(0, 3).toUpperCase();
  const namePart = productName.substring(0, 3).toUpperCase();
  const uniquePart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${namePart}-${uniquePart}`;
};

export const lowercaseFirstChars = (data: string): string => {
  return data
    .split(" ")
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join(" ");
};

export const uppercaseFirstChars = (data: string): string => {
  return data
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const replaceUnderscoresWithSpaces = (data: string): string => {
  return data.split("_").join(" ");
};

/* Dup */
export const replaceSpacesWithUnderscores = (data: string): string => {
  return data.split(" ").join("_");
};

export const generateUrlPaths = (data: string): string => {
  return data.split(" ").join("_");
};

export const decimalToString = (decimal: Decimal) => {
  return new Decimal(decimal).toFixed(2);
};

export const toDecimal = (value: string | number) => {
  return new Decimal(value);
};

export const decimalToNumber = (decimal: Decimal): number => {
  return Number(decimal);
};

export function generateInitials(name: string) {
  const nameParts = name.split(" ");
  let initials = "";
  for (const name of nameParts) {
    initials += name.slice(0, 1);
  }
  return initials.length > 2 ? initials.slice(0, 2) : initials;
}

export const fileToBase64 = (file: File): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result ? (reader.result as string) : null);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
