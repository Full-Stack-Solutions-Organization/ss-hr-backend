import { Types } from "mongoose";

export class Address {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public addressLine1: string,
        public addressLine2: string,
        public city: string,
        public state: string,
        public district: string,
        public country: string,
        public postalCode: string,
        public landmark: string,
        public primary: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}