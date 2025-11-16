import { Types } from "mongoose";
import { CareerData } from "../entities/careerData";
import { CreateCareerDataRequest, UpdateCareerDataRequest } from "../../infrastructure/dtos/user.dto";

export interface ICareerDataRepository {
  createCareerData(payload: CreateCareerDataRequest): Promise<CareerData | null>;

  updateCareerData(payload: UpdateCareerDataRequest): Promise<CareerData | null>;

  findCareerDataByUserId(userId: Types.ObjectId): Promise<CareerData | null>;
}