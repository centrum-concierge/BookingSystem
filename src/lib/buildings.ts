import "server-only";

import { randomUUID } from "node:crypto";
import { supabase } from "./supabase";
import type { AmenityRow, BuildingRow } from "@/types/database";

export type Amenity = {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  calBookingLink: string;
  termsAndConditions?: string;
  createdAt: string;
  updatedAt: string;
};

export type Building = {
  // id is the DB int8 stringified (e.g. "1", "2")
  id: string;
  // slug is derived from name — no slug column in DB
  slug: string;
  name: string;
  // mapped from DB "address" column
  location: string;
  description: string;
  images: string[];
  amenities: Amenity[];
  createdAt: string;
};

const BUCKET = "media";
// Only select columns that actually exist in the DB
const BUILDING_SELECT = `id, name, address, strata_plan, created_at, amenities(*, amenity_images(url, position))`;

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

// ---------- Row mappers ----------

function rowToAmenity(row: AmenityRow): Amenity {
  const images = ((row.amenity_images ?? []) as { url: string; position: number }[])
    .sort((a, b) => a.position - b.position)
    .map((i) => i.url);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    images,
    calBookingLink: row.cal_booking_link ?? "",
    termsAndConditions: row.terms_and_conditions ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToBuilding(row: BuildingRow): Building {
  const amenities = (row.amenities ?? [])
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(rowToAmenity);
  return {
    id: String(row.id),          // int8 → string
    slug: slugify(row.name),     // derived — no slug column in DB
    name: row.name,
    location: row.address ?? "", // DB column is "address"
    description: "",             // no description column in DB
    images: [],                  // no image column in DB
    amenities,
    createdAt: row.created_at,
  };
}

// ---------- Reads ----------

export async function getBuildings(): Promise<Building[]> {
  try {
    const { data, error } = await supabase
      .from("buildings")
      .select(BUILDING_SELECT)
      .order("created_at");
    if (error) return [];
    return (data ?? []).map(rowToBuilding);
  } catch (e) {
    console.error("[buildings] Failed to fetch buildings:", e);
    return [];
  }
}

export async function getBuildingBySlug(slug: string): Promise<Building | undefined> {
  // No slug column in DB — fetch all and match by derived slug
  const buildings = await getBuildings();
  return buildings.find((b) => b.slug === slug);
}

export async function getBuildingByName(name: string): Promise<Building | undefined> {
  const { data, error } = await supabase
    .from("buildings")
    .select(BUILDING_SELECT)
    .ilike("name", name)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToBuilding(data) : undefined;
}

// Note: building writes (insert/update/delete) are intentionally omitted.
// Buildings are managed directly in the database; the admin is read-only for buildings.

// ---------- Amenity writes ----------

export async function insertAmenity(buildingId: string, amenity: Amenity): Promise<void> {
  const { error } = await supabase.from("amenities").insert({
    id: amenity.id,
    building_id: parseInt(buildingId, 10), // buildings.id is int8
    slug: amenity.slug,
    name: amenity.name,
    description: amenity.description,
    cal_booking_link: amenity.calBookingLink,
    terms_and_conditions: amenity.termsAndConditions ?? null,
    created_at: amenity.createdAt,
    updated_at: amenity.updatedAt,
  });
  if (error) throw new Error(error.message);
  if (amenity.images.length > 0) {
    const { error: imgError } = await supabase.from("amenity_images").insert(
      amenity.images.map((url, position) => ({ amenity_id: amenity.id, url, position }))
    );
    if (imgError) throw new Error(imgError.message);
  }
}

export async function updateAmenity(
  id: string,
  fields: { slug: string; name: string; description: string; calBookingLink: string; termsAndConditions?: string; images: string[]; updatedAt: string }
): Promise<void> {
  const { error } = await supabase
    .from("amenities")
    .update({
      slug: fields.slug,
      name: fields.name,
      description: fields.description,
      cal_booking_link: fields.calBookingLink,
      terms_and_conditions: fields.termsAndConditions ?? null,
      updated_at: fields.updatedAt,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("amenity_images").delete().eq("amenity_id", id);
  if (fields.images.length > 0) {
    const { error: imgError } = await supabase.from("amenity_images").insert(
      fields.images.map((url, position) => ({ amenity_id: id, url, position }))
    );
    if (imgError) throw new Error(imgError.message);
  }
}

export async function deleteAmenityBySlug(buildingSlug: string, amenitySlug: string): Promise<void> {
  // No slug column in buildings — find by derived slug
  const buildings = await getBuildings();
  const building = buildings.find((b) => b.slug === buildingSlug);
  if (!building) throw new Error("Building not found.");
  const { error } = await supabase
    .from("amenities")
    .delete()
    .eq("building_id", parseInt(building.id, 10))
    .eq("slug", amenitySlug);
  if (error) throw new Error(error.message);
}

export async function getAmenitiesForBuilding(buildingId: number): Promise<Amenity[]> {
  const { data, error } = await supabase
    .from("amenities")
    .select("*, amenity_images(url, position)")
    .eq("building_id", buildingId)
    .order("created_at");
  if (error) return [];
  return (data ?? []).map(rowToAmenity);
}

// ---------- Storage ----------

export async function uploadFile(file: File, storagePath: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, Buffer.from(bytes), {
      contentType: file.type,
      upsert: true,
    });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}