import { Types } from "mongoose";
import { Address } from "../../domain/entities/address";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { CreateAddress, UpdateAddress } from "../../infrastructure/dtos/address.dtos";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/addressRepositoryImpl";

export class UserCreateAddressUseCase {
    constructor(
        private addressRepositoryImpl: AddressRepositoryImpl
    ) { }

    async execute(data: CreateAddress): Promise<ApiResponse<Address>> {
        try {

            const address = await this.addressRepositoryImpl.createAddress(data);
            if(!address) throw new Error("Address creating failed");

            return{ success: true, message: "Address created successfully", data: address }
        } catch (error) {
            console.log("UserCreateAddressUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to get testimonials");
        }
     }
}

export class UserUpdateAddressUseCase {
    constructor(
        private addressRepositoryImpl: AddressRepositoryImpl
    ) { }

    async execute(addressId: Types.ObjectId, data: UpdateAddress): Promise<ApiResponse<Address>> {
        try {
            const address = await this.addressRepositoryImpl.updateAddress(addressId, data);
            if(!address) throw new Error("Address update failed");

            return { success: true, message: "Address updated successfully", data: address };
        } catch (error) {
            console.log("UserUpdateAddressUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to update address");
        }
    }
}