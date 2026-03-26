"use server";

import { redirect } from "next/navigation";
import {
  generateId,
  getBuildingByName,
  getBuildingBySlug,
  insertBuilding,
  updateBuilding,
  deleteBuildingBySlug,
  insertAmenity,
  updateAmenity,
  deleteAmenityBySlug,
  uploadFile,
  slugify,
  type Amenity,
  type Building,
} from "@/lib/buildings";

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

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

export async function createBuildingAction(formData: FormData) {
    const calcomUserId = getText(formData, "calcomUserId");
    if (!calcomUserId) throw new Error("Cal.com Building ID is required.");
  const name = getText(formData, "name");
  if (!name) throw new Error("Building name is required.");

  const slug = slugify(name);
  const existing = await getBuildingBySlug(slug);
  if (existing) throw new Error("A building with that name already exists.");

  const primaryImage = getFile(formData, "buildingImage1");
  if (!primaryImage) throw new Error("At least one building image is required.");

  const uploadedImages = await Promise.all([
    uploadImage(primaryImage, `buildings/${slug}`),
    uploadImage(getFile(formData, "buildingImage2"), `buildings/${slug}`),
  ]);

  const now = new Date().toISOString();
  const building: Building = {
    id: generateId("building"),
    slug,
    name,
    location: getText(formData, "location"),
    description: getText(formData, "description"),
    images: uploadedImages.filter((p): p is string => Boolean(p)),
    amenities: [],
    calcomUserId,
    createdAt: now,
    updatedAt: now,
  };

  await insertBuilding(building);
  redirect(`/admin/buildings/${slug}`);
}

export async function deleteBuildingAction(formData: FormData) {
  const slug = getText(formData, "slug");
  await deleteBuildingBySlug(slug);
  redirect("/admin");
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

export async function updateBuildingAction(formData: FormData) {
    const calcomUserId = getText(formData, "calcomUserId");
    if (!calcomUserId) throw new Error("Cal.com Building ID is required.");
  const currentSlug = getText(formData, "currentSlug");
  const existing = await getBuildingBySlug(currentSlug);
  if (!existing) throw new Error("Building not found.");

  const name = getText(formData, "name") || existing.name;
  const newSlug = slugify(name);

  const image1 = getFile(formData, "buildingImage1")
    ? await uploadImage(getFile(formData, "buildingImage1"), `buildings/${newSlug}`)
    : (existing.images[0] ?? null);
  const image2 = getFile(formData, "buildingImage2")
    ? await uploadImage(getFile(formData, "buildingImage2"), `buildings/${newSlug}`)
    : (existing.images[1] ?? null);

  const now = new Date().toISOString();
  await updateBuilding(existing.id, {
    slug: newSlug,
    name,
    location: getText(formData, "location"),
    description: getText(formData, "description"),
    images: [image1, image2].filter((p): p is string => Boolean(p)),
    calcomUserId,
    updatedAt: now,
  });

  redirect(`/admin/buildings/${newSlug}`);
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
