import { Types } from "mongoose";
import { User } from "../../domain/entities/user";
import { LimitedRole } from "../../infrastructure/zod/common.zod";
import { CreateAdmin } from "../../domain/repositories/IUserRepository";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PasswordHasher } from "../../infrastructure/security/passwordHasher";
import { AdminFetchAllAdmins } from "../../domain/repositories/IUserRepository";
import { validateFile } from "../../infrastructure/validator/imageFileValidator";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { CreateAdminRequest, CreateAdminResponse } from "../../infrastructure/dtos/admin.dtos";

export class CreateAdminUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileUploadService: FileUploadService,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(payload: CreateAdminRequest): Promise<ApiResponse<CreateAdminResponse>> {
        try {
            let { fullName, email, password, phone, profileImage, role } = payload;

            const isValidFile = validateFile(profileImage);
            if (!isValidFile) throw new Error("Invalid profile image file");

            let profileImageUrl: string = "";
            if (profileImage) {
                profileImageUrl = await this.fileUploadService.uploadFile({
                    folder: "ss-hr-users-profileImage",
                    userId: role,
                    file: profileImage,
                });
            }

            const serialNumber: string = await this.userRepositoryImpl.generateNextSerialNumber();

            password = await PasswordHasher.hashPassword(password);
            const adminData = { fullName, email, password, phone, role }

            const createdAdmin = await this.userRepositoryImpl.createUser<CreateAdmin>({
                ...adminData,
                serialNumber,
                profileImage: profileImageUrl,
                isVerified: true,
            });

            const signedUrl = await this.signedUrlService.generateSignedUrl(
                createdAdmin.profileImage
            );

            const { phoneTwo, isVerified, verificationToken, googleId, updatedAt, password: adminPassword, ...newAdmin } = createdAdmin;

            return { success: true, message: "New admin created", data: { ...newAdmin, profileImage: signedUrl } }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in verifying otp");
        }
    }
}


export class DeleteAdminUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileDeleteService: FileDeleteService
    ) { }

    async execute(requesterRole: User["role"], adminId: Types.ObjectId): Promise<ApiResponse> {
        try {

            if (!adminId || !requesterRole) throw new Error("Invalid request");

            const targetAdmin = await this.userRepositoryImpl.findUserById(adminId);
            if (!targetAdmin) {
                throw new Error("Admin not found");
            }

            if (requesterRole === LimitedRole.User || requesterRole === LimitedRole.Admin) {
                throw new Error("You do not have permission to delete other users.");
            }

            if (targetAdmin.profileImage) {
                const deleted = await this.fileDeleteService.deleteFile(targetAdmin.profileImage);
                if (!deleted) throw new Error("Failed to delete admin's profile image.");
            }

            const response = await this.userRepositoryImpl.deleteUserById(adminId);
            if (!response) throw new Error("Admin deleting failed");

            return { success: true, message: 'Admin deleted successfully' };
        } catch (error) {
            console.log("DeleteAdminUseCase Error : ", error);
            throw handleUseCaseError(error || "Unexpected error in deleting admin");
        }
    }
}

export class AdminGetAllAdminsUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl
    ) { }

    async execute(payload: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllAdmins>> {
        try {
            const admins = await this.userRepositoryImpl.findAllAdmins(payload);
            if(!admins) throw new Error("No admins found in databse");

            return { success: true, message: "Fetched all admins", data: admins as AdminFetchAllAdmins }
        } catch (error) {
            throw handleUseCaseError(error || "Unexpected error in AdminGetAllAdminsUseCase");
        }
    }
}