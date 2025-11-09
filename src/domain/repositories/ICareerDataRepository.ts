import { CareerData } from "../entities/careerData";
import { CommonCareerDataType, CreateCareerDataRequest } from "../../infrastructure/dtos/user.dto";
import { Types } from "mongoose";

export interface ICareerDataRepository {
  createCareerData(payload: CreateCareerDataRequest): Promise<CareerData | null>;
  
  updateCareerData(payload: CommonCareerDataType): Promise<CareerData | null>;

  findCareerDataByUserId(userId: Types.ObjectId): Promise<CareerData | null>;
}