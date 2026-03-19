import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";

export type Amenity = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  calBookingLink: string;
  createdAt: string;
  updatedAt: string;
};

export type Building = {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  createdAt: string;
  updatedAt: string;
};

const dataFilePath = path.join(process.cwd(), "src", "data", "buildings.json");
const publicRootPath = path.join(process.cwd(), "public");

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getBuildings(): Promise<Building[]> {
  noStore();
  const fileContents = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(fileContents) as Building[];
}

export async function getBuildingBySlug(slug: string): Promise<Building | undefined> {
  const buildings = await getBuildings();
  return buildings.find((building) => building.slug === slug);
}

export async function getBuildingByName(name: string): Promise<Building | undefined> {
  const buildings = await getBuildings();
  return buildings.find((b) => b.name.toLowerCase() === name.toLowerCase());
}

export async function writeBuildings(buildings: Building[]): Promise<void> {
  await fs.writeFile(dataFilePath, `${JSON.stringify(buildings, null, 2)}\n`, "utf8");
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export async function saveUploadedFile(file: File | null, targetSegments: string[]): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const outputDirectory = path.join(publicRootPath, ...targetSegments);
  const outputPath = path.join(outputDirectory, `${Date.now()}-${fileName}`);

  await fs.mkdir(outputDirectory, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(arrayBuffer));

  return `/${path.relative(publicRootPath, outputPath).replace(/\\/g, "/")}`;
}