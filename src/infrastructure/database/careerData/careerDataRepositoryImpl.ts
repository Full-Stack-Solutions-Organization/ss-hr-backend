import { Types } from "mongoose";
import { CareerDataModel, ICareerData } from "./careerDataModel";
import { CareerData } from "../../../domain/entities/careerData";
import { CreateCareerDataRequest, UpdateCareerDataRequest } from "../../dtos/user.dto";
import { ICareerDataRepository } from "../../../domain/repositories/ICareerDataRepository";

export class CareerDataRepositoryImpl implements ICareerDataRepository {

    private mapToEntity(careerData: ICareerData): CareerData {
        return new CareerData(
            careerData._id,
            careerData.userId,
            careerData.currentSalary,
            careerData.expectedSalary,
            careerData.immediateJoiner,
            careerData.noticePeriod,
            careerData.experience,
            careerData.currentDesignation,
            careerData.currentCompany,
            careerData.industry,
            careerData.currentJobType,
            careerData.preferredJobTypes,
            careerData.preferredWorkModes,
            careerData.createdAt,
            careerData.updatedAt,
        );
    }

    async createCareerData(payload: CreateCareerDataRequest): Promise<CareerData | null> {
        try {
            const careerData = await CareerDataModel.create(payload);
            return this.mapToEntity(careerData) || null;
        } catch (error) {
            throw new Error("createCareerData error")
        }
    }

    async updateCareerData(payload: UpdateCareerDataRequest): Promise<CareerData | null> {
        try {
            const { _id, ...updateData } = payload;

            const cleanedFields = Object.fromEntries(
                Object.entries(updateData).filter(([_, v]) => v !== undefined)
            );

            const updatedCareerData = await CareerDataModel.findOneAndUpdate(
                { _id },
                { $set: cleanedFields },
                { new: true }
            );
            return updatedCareerData ? this.mapToEntity(updatedCareerData) : null;
        } catch (error) {
            throw new Error("updateCareerData error")
        }
    }

    async findCareerDataByUserId(userId: Types.ObjectId): Promise<CareerData | null> {
        try {
            const careerData = await CareerDataModel.findOne({ userId });
            return careerData ? this.mapToEntity(careerData) : null;
        } catch (error) {
            throw new Error("findCareerDataByUserId error");
        }
    }

}