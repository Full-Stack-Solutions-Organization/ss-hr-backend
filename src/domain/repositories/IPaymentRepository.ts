import { Types } from "mongoose"
import { Payment } from "../entities/payment"
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts"

export type CreatePayment = Pick<Payment,  "packageId" | "totalAmount" | "paidAmount" | "paymentMethod" | "paymentDate" | "paymentProof" | "adminNotes" | "balanceAmount" | "paymentStatus" | "userId">;
export type AdminFetchAllPayments = Array<Pick<Payment, "_id" | "totalAmount" | "paidAmount" | "balanceAmount" | "paymentMethod" | "paymentDate" | "paymentProof" | "adminNotes" | "paymentStatus" | "createdAt" | "updatedAt">>

export interface IPaymentRepository {

    createPayment(paymentData: CreatePayment): Promise<Payment>;
    findAllPayments({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>>;
    findPaymentById(paymentId: Types.ObjectId): Promise<Payment | null>;
    updatePayment(paymentData: Payment): Promise<Payment | null>;
    deletePayment(paymentId: Types.ObjectId): Promise<boolean>;
    getTotalCount(): Promise<number>;
    findPaymentsByCustomerId(customerId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>>;
    findPaymentsByPackageId(packageId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>>;
    findPaymentsByStatus(status: string, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>>;

}