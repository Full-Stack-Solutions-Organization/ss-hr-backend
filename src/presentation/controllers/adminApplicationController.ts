import { Types } from "mongoose";
import { Request, Response } from "express";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { paginationReqQuery } from "../../infrastructure/zod/common.zod";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { ApplicationRepositoryImpl } from "../../infrastructure/database/application/applicationRepositoryImpl";
import { AdminFetchAllApplicationsUseCase, AdminFetchApplicationDetailsUseCase, AdminUpdateApplicationStatusUseCase } from "../../application/adminUse-cases/adminApplicationUseCases";

const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const applicationRepositoryImpl = new ApplicationRepositoryImpl();
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);

const adminFetchAllApplicationsUseCase = new AdminFetchAllApplicationsUseCase(applicationRepositoryImpl);
const adminFetchApplicationDetailsUseCase = new AdminFetchApplicationDetailsUseCase(applicationRepositoryImpl, signedUrlService);
const adminUpdateApplicationStatusUseCase = new AdminUpdateApplicationStatusUseCase(applicationRepositoryImpl);

export class AdminApplicationController {
    constructor(
        private adminFetchAllApplicationsUseCase: AdminFetchAllApplicationsUseCase,
        private adminFetchApplicationDetailsUseCase: AdminFetchApplicationDetailsUseCase,
        private adminUpdateApplicationStatusUseCase: AdminUpdateApplicationStatusUseCase,
    ) {
        this.fetchAllApplications = this.fetchAllApplications.bind(this);
        this.fetchApplication = this.fetchApplication.bind(this);
        this.updateApplicationStatus = this.updateApplicationStatus.bind(this);
    }

    async fetchAllApplications(req: Request, res: Response) {
        try {
            const validatedData = paginationReqQuery.parse(req.query);
            const result = await this.adminFetchAllApplicationsUseCase.execute(validatedData);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res)
        }
    }

    async fetchApplication(req: Request, res: Response) {
        try {
            const applicationId = new Types.ObjectId(req.params.id);
            const result = await this.adminFetchApplicationDetailsUseCase.execute(applicationId);
            res.status(200).json(result);
        } catch (error) {
            HandleError.handle(error, res);
        }
    }

    async updateApplicationStatus(req: Request, res: Response) {
        try {
            const applicationId = new Types.ObjectId(req.params.id);
            const applicationStatus = req.body.status;
            const result = await this.adminUpdateApplicationStatusUseCase.execute({
                _id: applicationId,
                status: applicationStatus
            });
            res.status(200).json(result);
        } catch (error) {
            console.log("updateApplicationStatus error : ",error);
            HandleError.handle(error, res);
        }
    }
}

export const adminApplicationController = new AdminApplicationController(
    adminFetchAllApplicationsUseCase,
    adminFetchApplicationDetailsUseCase,
    adminUpdateApplicationStatusUseCase
);