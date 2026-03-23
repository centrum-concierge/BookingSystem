import "server-only";

import { randomUUID } from "node:crypto";
import { supabase } from "./supabase";

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

const BUCKET = "media";
const BUILDING_SELECT = `*, building_images(url, position), amenities(*, amenity_images(url, position))`;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToAmenity(row: any): Amenity {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBuilding(row: any): Building {
  const images = ((row.building_images ?? []) as { url: string; position: number }[])
    .sort((a, b) => a.position - b.position)
    .map((i) => i.url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const amenities = ((row.amenities ?? []) as any[])
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(rowToAmenity);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location ?? "",
    description: row.description ?? "",
    images,
    amenities,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------- Reads ----------

export async function getBuildings(): Promise<Building[]> {
  const { data, error } = await supabase
    .from("buildings")
    .select(BUILDING_SELECT)
    .order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToBuilding);
}

export async function getBuildingBySlug(slug: string): Promise<Building | undefined> {
  const { data, error } = await supabase
    .from("buildings")
    .select(BUILDING_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToBuilding(data) : undefined;
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

// ---------- Building writes ----------

export async function insertBuilding(building: Building): Promise<void> {
  const { error } = await supabase.from("buildings").insert({
    id: building.id,
    slug: building.slug,
    name: building.name,
    location: building.location,
    description: building.description,
    created_at: building.createdAt,
    updated_at: building.updatedAt,
  });
  if (error) throw new Error(error.message);
  if (building.images.length > 0) {
    const { error: imgError } = await supabase.from("building_images").insert(
      building.images.map((url, position) => ({ building_id: building.id, url, position }))
    );
    if (imgError) throw new Error(imgError.message);
  }
}

export async function updateBuilding(
  id: string,
  fields: { slug: string; name: string; location: string; description: string; images: string[]; updatedAt: string }
): Promise<void> {
  const { error } = await supabase
    .from("buildings")
    .update({ slug: fields.slug, name: fields.name, location: fields.location, description: fields.description, updated_at: fields.updatedAt })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("building_images").delete().eq("building_id", id);
  if (fields.images.length > 0) {
    const { error: imgError } = await supabase.from("building_images").insert(
      fields.images.map((url, position) => ({ building_id: id, url, position }))
    );
    if (imgError) throw new Error(imgError.message);
  }
}

export async function deleteBuildingBySlug(slug: string): Promise<void> {
  const { error } = await supabase.from("buildings").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

// ---------- Amenity writes ----------

export async function insertAmenity(buildingId: string, amenity: Amenity): Promise<void> {
  const { error } = await supabase.from("amenities").insert({
    id: amenity.id,
    building_id: buildingId,
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
  const { data: building, error: bErr } = await supabase
    .from("buildings")
    .select("id")
    .eq("slug", buildingSlug)
    .maybeSingle();
  if (bErr) throw new Error(bErr.message);
  if (!building) throw new Error("Building not found.");
  const { error } = await supabase
    .from("amenities")
    .delete()
    .eq("building_id", building.id)
    .eq("slug", amenitySlug);
  if (error) throw new Error(error.message);
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