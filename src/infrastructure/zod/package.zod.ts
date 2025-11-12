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

