import { Types } from "mongoose";
import { PaymentMethodType, PaymentStatusType } from "../../infrastructure/zod/common.zod";

export class Payment {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public packageId: Types.ObjectId,
        public totalAmount: number,
        public paidAmount: number,
        public balanceAmount: number,
        public paymentMethod: PaymentMethodType,
        public paymentDate: Date,
        public paymentProof: string,
        public adminNotes: string,
        public paymentStatus: PaymentStatusType,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }

}