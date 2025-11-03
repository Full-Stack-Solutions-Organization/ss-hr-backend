import { Types } from "mongoose";
import { AddressModel, IAddress } from "./address.model";
import { Address } from "../../../domain/entities/address";
import { CreateAddress, UpdateAddress } from "../../dtos/address.dtos";
import { IAddressRepository } from "../../../domain/repositories/IAddressRepository";

export class AddressRepositoryImpl implements IAddressRepository {
  private mapToEntity(address: IAddress): Address {
    return new Address(
      address._id,
      address.userId as Types.ObjectId,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.district,
      address.country,
      address.postalCode,
      address.landmark,
      address.primary,
      address.createdAt,
      address.updatedAt,
    );
  }

  async createAddress(payload: CreateAddress): Promise<Address | null> {
    try {
      const created = await AddressModel.create({ ...payload });
      return this.mapToEntity(created);
    } catch (error) {
      throw new Error("Failed to create address");
    }
  }

  async updateAddress(addressId: Types.ObjectId, updatedData: UpdateAddress): Promise<Address | null> {
    try {
      const updated = await AddressModel.findByIdAndUpdate(addressId, updatedData, { new: true });
      return updated ? this.mapToEntity(updated) : null;
    } catch (error) {
      throw new Error("Failed to update address");
    }
  }

  async findAddressById(addressId: Types.ObjectId): Promise<Address | null> {
    try {
      const found = await AddressModel.findById(addressId);
      return found ? this.mapToEntity(found) : null;
    } catch (error) {
      throw new Error("Address not found");
    }
  }

  async findAddressesByUserId(userId: Types.ObjectId): Promise<Address[]> {
    try {
      const list = await AddressModel.find({ userId }).sort({ createdAt: -1 });
      return list.map((doc) => this.mapToEntity(doc));
    } catch (error) {
      throw new Error("Failed to fetch user addresses");
    }
  }
}


