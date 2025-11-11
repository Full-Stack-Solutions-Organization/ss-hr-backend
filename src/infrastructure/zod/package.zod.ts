import { z } from "zod";
import { packageName, description, priceIN, priceUAE, packageType, packageDuration, features, food, accommodation, travelCard, utilityBills, airportPickup, jobGuidance, s3FileKey, } from "./common.zod";

export const createPackageSchema = z.object({
  food,
  image: s3FileKey,
  features,
  priceIN,
  priceUAE,
  travelCard,
  description,
  packageName,
  packageType,
  jobGuidance,
  utilityBills,
  accommodation,
  airportPickup,
  packageDuration,
});

export const updatePackageSchema = z.object({
  food: food.optional(),
  image: s3FileKey.optional(),
  features: features.optional(),
  priceIN: priceIN.optional(),
  priceUAE: priceUAE.optional(),
  travelCard: travelCard.optional(),
  description: description.optional(),
  packageName: packageName.optional(),
  packageType: packageType.optional(),
  jobGuidance: jobGuidance.optional(),
  utilityBills: utilityBills.optional(),
  accommodation: accommodation.optional(),
  airportPickup: airportPickup.optional(),
  packageDuration: packageDuration.optional(),
});


