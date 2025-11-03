import { Address } from "../../domain/entities/address";

export type CreateAddress = Pick<
  Address,
  | "userId"
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "state"
  | "district"
  | "country"
  | "postalCode"
  | "landmark"
  | "primary"
>;

export type UpdateAddress = Partial<
  Pick<
    Address,
    | "addressLine1"
    | "addressLine2"
    | "city"
    | "state"
    | "district"
    | "country"
    | "postalCode"
    | "landmark"
    | "primary"
  >
>;