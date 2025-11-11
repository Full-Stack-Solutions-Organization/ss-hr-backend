import { Types } from "mongoose";

// export type WorkMode = "onsite" | "remote" | "hybrid";
// export type JobType = "full-time" | "part-time" | "contract" | "internship" | "freelance";

export enum WorkMode {
  Onsite = "onsite",
  Remote = "remote",
  Hybrid = "hybrid",
}

export enum JobType {
  FullTime = "full-time",
  PartTime = "part-time",
  Contract = "contract",
  Internship = "internship",
  Freelance = "freelance",
}

export class CareerData {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public currentSalary: number,
        public expectedSalary: number,
        public immediateJoiner: boolean,
        public noticePeriod: number,
        public experience: string,
        public currentDesignation: string,
        public currentCompany: string,
        public industry: string,
        public currentJobType: JobType,
        public preferredJobTypes: JobType[],
        public preferredWorkModes: WorkMode[],
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}