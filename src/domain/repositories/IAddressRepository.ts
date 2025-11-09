import { Types } from "mongoose";
import { Address } from "../entities/address";
import { CreateAddress, UpdateAddress } from "../../infrastructure/dtos/address.dtos";

export interface IAddressRepository {
  createAddress(payload: CreateAddress): Promise<Address | null>;

  updateAddress(addressId: Types.ObjectId, updatedData: UpdateAddress): Promise<Address | null>;

  findAddressById(addressId: Types.ObjectId): Promise<Address | null>;

  findAddressesByUserId(userId: Types.ObjectId): Promise<Address | null>;
}


