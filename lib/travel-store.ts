"use client";

import { defaultTravelDataset, getFeaturedDestinations, type TravelDataset } from "@/lib/travel-data";

const STORAGE_KEY = "skyline-travel-dataset";

export function readTravelDataset(): TravelDataset {
  if (typeof window === "undefined") return defaultTravelDataset;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultTravelDataset;

  try {
    return JSON.parse(raw) as TravelDataset;
  } catch {
    return defaultTravelDataset;
  }
}

export function saveTravelDataset(dataset: TravelDataset) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
}

export function resetTravelDataset() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getLandingDestinations(dataset: TravelDataset) {
  const featured = getFeaturedDestinations(dataset);
  return featured.length > 0 ? featured : dataset.destinations;
}
