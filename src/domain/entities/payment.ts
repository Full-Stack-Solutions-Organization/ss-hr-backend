import { Types } from "mongoose";

export enum PaymentMethod {
    googlePay = "googlepay",
    bankTransfer = "banktransfer", 
    cash = "cash"
}

export enum PaymentStatus {
    pending = "pending",
    partiallyPaid = "partiallypaid",
    fullyPaid = "fullypaid"
}

export class Payment {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public packageId: Types.ObjectId,
        public totalAmount: number,
        public paidAmount: number,
        public balanceAmount: number,
        public paymentMethod: PaymentMethod,
        public paymentDate: Date,
        public paymentProof: string,
        public adminNotes: string,
        public paymentStatus: PaymentStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }

}