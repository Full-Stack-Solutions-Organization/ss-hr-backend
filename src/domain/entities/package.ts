import { Types } from "mongoose";
import { PackageType } from "../../infrastructure/zod/common.zod";

export class Package {
    constructor(
        public _id: Types.ObjectId,
        public packageName: string,
        public description: string,
        public priceIN: number,
        public priceUAE: number,
        public packageType: PackageType,
        public packageDuration: number,
        public features: string[],
        public food: boolean,
        public accommodation: boolean,
        public travelCard: boolean,
        public utilityBills: boolean,
        public airportPickup: boolean,
        public jobGuidance: boolean,
        public createdAt: string,
        public updatedAt: string,
    ) { }
}