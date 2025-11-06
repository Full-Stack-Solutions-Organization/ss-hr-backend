import { CareerDataModel, ICareerData } from "./careerDataModel";
import { CareerData } from "../../../domain/entities/careerData";
import { CreateCareerDataRequest, CommonCareerDataType } from "../../dtos/user.dto";
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
            careerData.resume,
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

    async updateCareerData(payload: CommonCareerDataType): Promise<CareerData | null> {
        try {
            const { _id, ...updateData } = payload;

            const updatedCareerData = await CareerDataModel.findOneAndUpdate(
                { _id },
                { $set: updateData },
                { new: true }
            );
            return updatedCareerData ? this.mapToEntity(updatedCareerData) : null;
        } catch (error) {
            throw new Error("updateCareerData error")
        }
    }

}