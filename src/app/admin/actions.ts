"use server";

import { redirect } from "next/navigation";
import {
  generateId,
  getBuildingByName,
  getBuildingBySlug,
  getBuildings,
  saveUploadedFile,
  slugify,
  type Amenity,
  type Building,
  writeBuildings,
} from "@/lib/buildings";

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!value || !(value instanceof File) || value.size === 0) return null;
  return value;
}

export async function createBuildingAction(formData: FormData) {
  const name = getText(formData, "name");
  if (!name) throw new Error("Building name is required.");

  const slug = slugify(name);

  const buildings = await getBuildings();
  if (buildings.some((b) => b.slug === slug)) {
    throw new Error("A building with that name already exists.");
  }

  const primaryImage = getFile(formData, "buildingImage1");
  if (!primaryImage) throw new Error("At least one building image is required.");

  const uploadedImages = await Promise.all([
    saveUploadedFile(primaryImage, ["uploads", "buildings", slug]),
    saveUploadedFile(getFile(formData, "buildingImage2"), ["uploads", "buildings", slug]),
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
    createdAt: now,
    updatedAt: now,
  };

  await writeBuildings([...buildings, building]);
  redirect(`/admin/buildings/${slug}`);
}

export async function deleteBuildingAction(formData: FormData) {
  const slug = getText(formData, "slug");
  const buildings = await getBuildings();
  await writeBuildings(buildings.filter((b) => b.slug !== slug));
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
    saveUploadedFile(firstImage, ["uploads", "amenities", buildingSlug, amenitySlug]),
    saveUploadedFile(getFile(formData, "amenityImage2"), ["uploads", "amenities", buildingSlug, amenitySlug]),
    saveUploadedFile(getFile(formData, "amenityImage3"), ["uploads", "amenities", buildingSlug, amenitySlug]),
    saveUploadedFile(getFile(formData, "amenityImage4"), ["uploads", "amenities", buildingSlug, amenitySlug]),
    saveUploadedFile(getFile(formData, "amenityImage5"), ["uploads", "amenities", buildingSlug, amenitySlug]),
  ]);

  const now = new Date().toISOString();
  const amenity: Amenity = {
    id: generateId("amenity"),
    slug: amenitySlug,
    name: amenityName,
    description: getText(formData, "description"),
    images: uploadedImages.filter((p): p is string => Boolean(p)),
    calBookingLink: getText(formData, "calBookingLink"),
    createdAt: now,
    updatedAt: now,
  };

  const buildings = await getBuildings();
  await writeBuildings(
    buildings.map((b) =>
      b.slug !== buildingSlug
        ? b
        : { ...b, updatedAt: now, amenities: [...b.amenities, amenity] }
    )
  );

  redirect(`/admin/buildings/${buildingSlug}`);
}

export async function deleteAmenityAction(formData: FormData) {
  const buildingSlug = getText(formData, "buildingSlug");
  const amenitySlug = getText(formData, "amenitySlug");
  const buildings = await getBuildings();

  await writeBuildings(
    buildings.map((b) =>
      b.slug !== buildingSlug
        ? b
        : {
            ...b,
            updatedAt: new Date().toISOString(),
            amenities: b.amenities.filter((a) => a.slug !== amenitySlug),
          }
    )
  );

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
  const currentSlug = getText(formData, "currentSlug");
  const buildings = await getBuildings();
  const existing = buildings.find((b) => b.slug === currentSlug);
  if (!existing) throw new Error("Building not found.");

  const name = getText(formData, "name") || existing.name;
  const newSlug = slugify(name);

  const image1File = getFile(formData, "buildingImage1");
  const image2File = getFile(formData, "buildingImage2");

  const image1 = image1File
    ? await saveUploadedFile(image1File, ["uploads", "buildings", newSlug])
    : (existing.images[0] ?? null);
  const image2 = image2File
    ? await saveUploadedFile(image2File, ["uploads", "buildings", newSlug])
    : (existing.images[1] ?? null);

  const now = new Date().toISOString();
  const updated: Building = {
    ...existing,
    slug: newSlug,
    name,
    location: getText(formData, "location"),
    description: getText(formData, "description"),
    images: [image1, image2].filter((p): p is string => Boolean(p)),
    updatedAt: now,
  };

  await writeBuildings(buildings.map((b) => (b.slug === currentSlug ? updated : b)));
  redirect(`/admin/buildings/${newSlug}`);
}

export async function updateAmenityAction(formData: FormData) {
  const buildingSlug = getText(formData, "buildingSlug");
  const currentAmenitySlug = getText(formData, "currentAmenitySlug");
  const buildings = await getBuildings();
  const building = buildings.find((b) => b.slug === buildingSlug);
  if (!building) throw new Error("Building not found.");

  const existing = building.amenities.find((a) => a.slug === currentAmenitySlug);
  if (!existing) throw new Error("Amenity not found.");

  const name = getText(formData, "name") || existing.name;
  const newSlug = slugify(name);

  const uploadedImages = await Promise.all(
    [1, 2, 3, 4, 5].map((n, i) => {
      const file = getFile(formData, `amenityImage${n}`);
      return file
        ? saveUploadedFile(file, ["uploads", "amenities", buildingSlug, newSlug])
        : Promise.resolve(existing.images[i] ?? null);
    })
  );

  const now = new Date().toISOString();
  const updated: Amenity = {
    ...existing,
    slug: newSlug,
    name,
    description: getText(formData, "description"),
    calBookingLink: getText(formData, "calBookingLink"),
    images: uploadedImages.filter((p): p is string => Boolean(p)),
    updatedAt: now,
  };

  await writeBuildings(
    buildings.map((b) =>
      b.slug !== buildingSlug
        ? b
        : {
            ...b,
            updatedAt: now,
            amenities: b.amenities.map((a) =>
              a.slug === currentAmenitySlug ? updated : a
            ),
          }
    )
  );
  redirect(`/admin/buildings/${buildingSlug}`);
}

