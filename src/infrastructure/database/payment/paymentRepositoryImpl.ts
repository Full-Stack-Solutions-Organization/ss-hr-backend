import { Types } from "mongoose";
import { IPayment, PaymentModel } from "./paymentModel";
import { Payment } from "../../../domain/entities/payment";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { AdminFetchAllPayments, CreatePayment, IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";

export class PaymentRepositoryImpl implements IPaymentRepository {
  private mapToEntity(payment: IPayment): Payment {
    return new Payment(
      payment._id,
      payment.customerName,
      payment.packageName,
      payment.totalAmount,
      payment.paidAmount,
      payment.balanceAmount,
      payment.paymentMethod,
      payment.paymentDate,
      payment.adminNotes,
      payment.referenceId,
      payment.paymentProof,
      payment.paymentStatus,
      payment.createdAt,
      payment.updatedAt,
    );
  }

  async createPayment(paymentData: CreatePayment): Promise<Payment> {
    try {
      const balanceAmount = paymentData.totalAmount - paymentData.paidAmount;
      let status = "pending";

      if (paymentData.paidAmount === 0) {
        status = "pending";
      } else if (paymentData.paidAmount >= paymentData.totalAmount) {
        status = "fullypaid";
      } else {
        status = "partiallypaid";
      }

      const createdPayment = await PaymentModel.create({
        ...paymentData,
        balanceAmount,
        status
      });
      return this.mapToEntity(createdPayment);
    } catch (error: any) {
      throw new Error("Unable to create payment, please try again after a few minutes.");
    }
  }

  async findAllPayments({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find({}, {
          _id: 1, customerName: 1, packageName: 1, totalAmount: 1, paidAmount: 1, balanceAmount: 1, paymentStatus: 1
        })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments from database.");
    }
  }

  async findPaymentById(paymentId: Types.ObjectId): Promise<Payment | null> {
    try {
      const paymentData = await PaymentModel.findById(paymentId);
      return paymentData ? this.mapToEntity(paymentData) : null;
    } catch (error) {
      throw new Error("Payment not found.");
    }
  }

  async updatePayment(paymentData: Payment): Promise<Payment | null> {
    try {
      const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentData._id, paymentData, {
        new: true,
      });
      return updatedPayment ? this.mapToEntity(updatedPayment) : null;
    } catch (error) {
      throw new Error("Unable to update payment.");
    }
  }

  async deletePayment(paymentId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await PaymentModel.findByIdAndDelete(paymentId);
      return !!result;
    } catch (error) {
      throw new Error("Failed to delete payment");
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await PaymentModel.countDocuments();
    } catch (error) {
      throw new Error("Failed to get total count");
    }
  }

  async findPaymentsByCustomerId(customerId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { customerId }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ customerId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by customer from database.");
    }
  }

  async findPaymentsByPackageId(packageId: Types.ObjectId, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { packageId }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ packageId }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by package from database.");
    }
  }

  async findPaymentsByStatus(status: string, { page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllPayments>> {
    try {
      const skip = (page - 1) * limit;
      const [payments, totalCount] = await Promise.all([
        PaymentModel.find(
          { status }
        )
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        PaymentModel.countDocuments({ status }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: payments.map(this.mapToEntity),
        totalPages,
        currentPage: page,
        totalCount,
      };
    } catch (error) {
      throw new Error("Failed to fetch payments by status from database.");
    }
  }
}