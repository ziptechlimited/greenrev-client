import type { Product } from "@/types/product";
import type { CarEntry } from "@/components/shared/InventoryCard";

export function transformProductToCarEntry(product: Product): CarEntry {
  return {
    id: product._id?.toString() || product.id || "",
    name: product.name,
    make: product.make,
    year: product.year || 0,
    mileage: product.mileage || "N/A",
    price: product.price,
    color: product.color || { name: "Default", hex: "#000000" },
    image: product.image,
    specs: {
      "0_100": product.specs?.acceleration ?? 0,
      horsepower: product.specs?.horsepower ?? 0,
      torque: product.specs?.torque || "N/A",
      transmission: product.specs?.transmission || "N/A",
      topSpeed: product.specs?.topSpeed || "N/A",
    },
  };
}

export type PartEntry = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  brand: string;
  specs: string[];
};

export function transformProductToPartEntry(product: Product): PartEntry {
  const priceNum = product.priceValue || parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
  
  const specs: string[] = [];
  if (product.specs?.horsepower) specs.push(`${product.specs.horsepower} HP`);
  if (product.specs?.torque) specs.push(product.specs.torque);
  if (product.specs?.transmission) specs.push(product.specs.transmission);
  if (product.specs?.compatibility) specs.push(product.specs.compatibility);
  if (product.specs?.warranty) specs.push(product.specs.warranty);

  return {
    id: product._id?.toString() || product.id || "",
    name: product.name,
    category: product.make,
    price: priceNum,
    description: product.description || "",
    image: product.image,
    brand: product.vendorName || product.make,
    specs: specs.length > 0 ? specs : ["Premium Quality"],
  };
}
