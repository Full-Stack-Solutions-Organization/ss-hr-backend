import { Types } from "mongoose";
import { JobtypeType, WorkModeType } from "../../infrastructure/zod/common.zod";

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
        public currentJobType: JobtypeType,
        public preferredJobTypes: JobtypeType[],
        public preferredWorkModes: WorkModeType[],
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}