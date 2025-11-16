import { Types } from "mongoose";
import { ApplicationStatusType } from "../../infrastructure/zod/common.zod";

export class Application {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public jobId: Types.ObjectId,
        public status: ApplicationStatusType,
        public applicationUniqueId: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}




