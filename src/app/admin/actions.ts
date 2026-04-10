"use server";

import { redirect } from "next/navigation";
import {
  generateId,
  getBuildingByName,
  getBuildingBySlug,
  insertAmenity,
  updateAmenity,
  deleteAmenityBySlug,
  uploadFile,
  slugify,
  type Amenity,
} from "@/lib/buildings";

import { getText } from "@/lib/form-utils";

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!value || !(value instanceof File) || value.size === 0) return null;
  return value;
}

async function uploadImage(file: File | null, storagePath: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()}`;
  return uploadFile(file, `${storagePath}/${safeName}`);
}

export async function createAmenityAction(formData: FormData) {
  const buildingSlug = getText(formData, "buildingSlug");
  const building = await getBuildingBySlug(buildingSlug);
  if (!building) throw new Error("Building not found.");

  const amenityName = getText(formData, "name");
  if (!amenityName) throw new Error("Amenity name is required.");

  const amenitySlug = slugify(amenityName);
  if (building.amenities.some((a) => a.slug === amenitySlug)) {
    throw new Error("An amenity with that name already exists in this building.");
  }

  const firstImage = getFile(formData, "amenityImage1");
  if (!firstImage) throw new Error("At least one amenity image is required.");

  const uploadedImages = await Promise.all([
    uploadImage(firstImage, `amenities/${buildingSlug}/${amenitySlug}`),
    uploadImage(getFile(formData, "amenityImage2"), `amenities/${buildingSlug}/${amenitySlug}`),
    uploadImage(getFile(formData, "amenityImage3"), `amenities/${buildingSlug}/${amenitySlug}`),
    uploadImage(getFile(formData, "amenityImage4"), `amenities/${buildingSlug}/${amenitySlug}`),
    uploadImage(getFile(formData, "amenityImage5"), `amenities/${buildingSlug}/${amenitySlug}`),
  ]);

  const now = new Date().toISOString();
  const amenity: Amenity = {
    id: generateId("amenity"),
    slug: amenitySlug,
    name: amenityName,
    description: getText(formData, "description"),
    images: uploadedImages.filter((p): p is string => Boolean(p)),
    calBookingLink: getText(formData, "calBookingLink"),
    termsAndConditions: getText(formData, "termsAndConditions") || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await insertAmenity(building.id, amenity);
  redirect(`/admin/buildings/${buildingSlug}`);
}

export async function deleteAmenityAction(formData: FormData) {
  const buildingSlug = getText(formData, "buildingSlug");
  const amenitySlug = getText(formData, "amenitySlug");
  await deleteAmenityBySlug(buildingSlug, amenitySlug);
  redirect(`/admin/buildings/${buildingSlug}`);
}

export async function findBuildingAction(formData: FormData) {
  const name = getText(formData, "buildingName");
  if (!name) redirect("/?error=empty");

  const building = await getBuildingByName(name);
  if (!building) redirect(`/?error=not-found&name=${encodeURIComponent(name)}`);

  redirect(`/${building.slug}`);
}

export async function updateAmenityAction(formData: FormData) {
  const buildingSlug = getText(formData, "buildingSlug");
  const currentAmenitySlug = getText(formData, "currentAmenitySlug");
  const building = await getBuildingBySlug(buildingSlug);
  if (!building) throw new Error("Building not found.");

  const existing = building.amenities.find((a) => a.slug === currentAmenitySlug);
  if (!existing) throw new Error("Amenity not found.");

  const name = getText(formData, "name") || existing.name;
  const newSlug = slugify(name);

  const uploadedImages = await Promise.all(
    [1, 2, 3, 4, 5].map((n, i) => {
      const file = getFile(formData, `amenityImage${n}`);
      return file
        ? uploadImage(file, `amenities/${buildingSlug}/${newSlug}`)
        : Promise.resolve(existing.images[i] ?? null);
    })
  );

  const now = new Date().toISOString();
  await updateAmenity(existing.id, {
    slug: newSlug,
    name,
    description: getText(formData, "description"),
    calBookingLink: getText(formData, "calBookingLink"),
    termsAndConditions: getText(formData, "termsAndConditions") || undefined,
    images: uploadedImages.filter((p): p is string => Boolean(p)),
    updatedAt: now,
  });

  redirect(`/admin/buildings/${buildingSlug}`);
}
