import { Types } from "mongoose";

export class Application {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public jobId: Types.ObjectId,
        public status: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}




