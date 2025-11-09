// **** Controller for user side ( not for admins user side);

import { Types } from "mongoose";
import { Request, Response } from "express";
import { DecodedUser } from "../../express";
import { S3Client } from "@aws-sdk/client-s3";
import { aws_s3Config } from "../../config/env";
import { HandleError } from "../../infrastructure/error/error";
import { S3FileKeyZodSchmema } from "../../infrastructure/zod/s3.zod";
import { ValidateObjectId } from "../../infrastructure/zod/common.zod";
import { S3KeyGenerator } from "../../infrastructure/helper/generateS3key";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { RandomStringGenerator } from "../../infrastructure/helper/generateRandomString";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/addressRepositoryImpl";
import { UseGetTestimonialsUseCase } from "../../application/userUseCase.ts/userTestimonialUseCases";
import { addressSchema, careerDataSchema, updateUserInfoSchema } from "../../infrastructure/zod/user.zod";
import { SignedUrlRepositoryImpl } from "../../infrastructure/database/signedUrl/signedUrlRepositoryImpl";
import { CareerDataRepositoryImpl } from "../../infrastructure/database/careerData/careerDataRepositoryImpl";
import { TestimonialRepositoryImpl } from "../../infrastructure/database/testimonial/testimonialRepositoryImpl";
import { GetAllUsersForChatSideBarUseCase } from "../../application/commonUse-cases/getAllUsersForChatSidebarUseCase";
import { UserCreateAddressUseCase, UserUpdateAddressUseCase } from "../../application/userUseCase.ts/userAddressUseCases";
import { UserCreateCareerDataUseCase, UserUpdateCareerDataUseCase } from "../../application/userUseCase.ts/userCareerDataUseCases";
import { UserUpdatePorifleDataUseCase, UserUpdateResumeKeyUseCase, UserUpdateUserProfileImageUseCase } from "../../application/userUseCase.ts/userProfileUseCases";

const s3 = new S3Client();
const fileDeleteService = new FileDeleteService(s3);
const userRepositoryImpl = new UserRepositoryImpl();
const randomStringGenerator = new RandomStringGenerator();
const addressRepositoryImpl = new AddressRepositoryImpl();
const signedUrlRepositoryImpl = new SignedUrlRepositoryImpl();
const careerDataRepositoryImpl = new CareerDataRepositoryImpl();
const s3KeyGenerator = new S3KeyGenerator(randomStringGenerator);
const testimonialRepositoryImpl = new TestimonialRepositoryImpl();
const fileUploadService = new FileUploadService(s3, s3KeyGenerator);
const signedUrlService = new SignedUrlService(aws_s3Config.bucketName, signedUrlRepositoryImpl);

const userCreateAddressUseCase = new UserCreateAddressUseCase(addressRepositoryImpl);
const userUpdateAddressUseCase = new UserUpdateAddressUseCase(addressRepositoryImpl);
const userUpdateResumeKeyUseCase = new UserUpdateResumeKeyUseCase(userRepositoryImpl);
const userUpdatePorifleDataUseCase = new UserUpdatePorifleDataUseCase(userRepositoryImpl);
const userCreateCareerDataUseCase = new UserCreateCareerDataUseCase(careerDataRepositoryImpl);
const userUpdateCareerDataUseCase = new UserUpdateCareerDataUseCase(careerDataRepositoryImpl);
const useGetTestimonialsUseCase = new UseGetTestimonialsUseCase(testimonialRepositoryImpl, signedUrlService);
const getAllUsersForChatSideBarUseCase = new GetAllUsersForChatSideBarUseCase(userRepositoryImpl, signedUrlService);
const userUpdateUserProfileImageUseCase = new UserUpdateUserProfileImageUseCase(userRepositoryImpl, fileDeleteService, fileUploadService, signedUrlService);

class UserController {
    constructor(
        private getAllUsersForChatSideBarUseCase: GetAllUsersForChatSideBarUseCase,
        private userUpdateUserProfileImageUseCase: UserUpdateUserProfileImageUseCase,
        private useGetTestimonialsUseCase: UseGetTestimonialsUseCase,
        private userUpdatePorifleDataUseCase: UserUpdatePorifleDataUseCase,
        private userCreateAddressUseCase: UserCreateAddressUseCase,
        private userUpdateAddressUseCase: UserUpdateAddressUseCase,
        private userCreateCareerDataUseCase: UserCreateCareerDataUseCase,
        private userUpdateCareerDataUseCase: UserUpdateCareerDataUseCase,
        private userUpdateResumeKeyUseCase: UserUpdateResumeKeyUseCase,
    ) {
        this.getAdminsForChatSidebar = this.getAdminsForChatSidebar.bind(this);
        this.updateUserProfileImage = this.updateUserProfileImage.bind(this);
        this.getTestimonilas = this.getTestimonilas.bind(this);
        this.updateProfileDetails = this.updateProfileDetails.bind(this);
        this.createAddress = this.createAddress.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.createCareerData = this.createCareerData.bind(this);
        this.updateCareerData = this.updateCareerData.bind(this);
        this.updateResumeKey = this.updateResumeKey.bind(this);
    }

    async getAdminsForChatSidebar(req: Request, res: Response) {
        try {
            const result = await this.getAllUsersForChatSideBarUseCase.execute(false);
            res.status(200).json(result);
        } catch (error) {
            console.log("getAllUsersForChatSidebar error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateUserProfileImage(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const file = req.file;
            if (!userId || !file) throw new Error("Invalid request.");
            const result = await this.userUpdateUserProfileImageUseCase.execute({ userId: new Types.ObjectId(userId), file });
            console.log("result : ", result);
            res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonilas error : ", error);
            HandleError.handle(error, res);
        }
    }

    async getTestimonilas(req: Request, res: Response) {
        try {
            const result = await this.useGetTestimonialsUseCase.execute();
            res.status(200).json(result);
        } catch (error) {
            console.log("getTestimonilas error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateProfileDetails(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const validatedData = updateUserInfoSchema.parse(req.body);
            const result = await this.userUpdatePorifleDataUseCase.execute({
                _id: new Types.ObjectId(userId),
                ...validatedData,
                dob: new Date(validatedData.dob),
            });
            res.status(200).json(result);
        } catch (error) {
            console.log("updateProfileDetails error : ", error);
            HandleError.handle(error, res);
        }
    }

    async createAddress(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const validatedData = addressSchema.parse(req.body);
            const result = await this.userCreateAddressUseCase.execute({
                userId: new Types.ObjectId(userId),
                ...validatedData
            });
            res.status(201).json(result);
        } catch (error) {
            console.log("createAddress error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateAddress(req: Request, res: Response) {
        try {
            const { id: addressId } = req.params;
            const validatedData = addressSchema.parse(req.body);
            const result = await this.userUpdateAddressUseCase.execute(new Types.ObjectId(addressId), validatedData);
            res.status(200).json(result);
        } catch (error) {
            console.log("updateAddress error : ", error);
            HandleError.handle(error, res);
        }
    }

    async createCareerData(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const validatedData = careerDataSchema.parse(req.body);
            const result = await this.userCreateCareerDataUseCase.execute({
                userId: new Types.ObjectId(userId),
                ...validatedData
            });
            res.status(200).json(result);
        } catch (error) {
            console.log("createCareerData error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateCareerData(req: Request, res: Response) {
        try {
            const validatedParams = ValidateObjectId(req.params.id, "careerData id");
            const validatedData = careerDataSchema.parse(req.body);
            const result = await this.userUpdateCareerDataUseCase.execute({
                _id: new Types.ObjectId(validatedParams.id),
                ...validatedData
            });
            res.status(200).json(result);
        } catch (error) {
            console.log("updateCareerData error : ", error);
            HandleError.handle(error, res);
        }
    }

    async updateResumeKey(req: Request, res: Response) {
        try {
            const userId = (req.user as DecodedUser).userId;
            const validatedData = S3FileKeyZodSchmema.parse(req.body);
            const result = await this.userUpdateResumeKeyUseCase.execute(new Types.ObjectId(userId), validatedData.key);
            res.status(200).json(result);
        } catch (error) {
            console.log("updateResumeKey error : ", error);
            HandleError.handle(error, res);
        }
    }

}

export const userController = new UserController(
    getAllUsersForChatSideBarUseCase,
    userUpdateUserProfileImageUseCase,
    useGetTestimonialsUseCase,
    userUpdatePorifleDataUseCase,
    userCreateAddressUseCase,
    userUpdateAddressUseCase,
    userCreateCareerDataUseCase,
    userUpdateCareerDataUseCase,
    userUpdateResumeKeyUseCase
);

