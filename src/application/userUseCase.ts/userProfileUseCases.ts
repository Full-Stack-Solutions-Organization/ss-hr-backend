import { User } from "../../domain/entities/user";
import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { validateFile } from "../../infrastructure/validator/imageFileValidator";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { FileDeleteService, FileUploadService } from "../../infrastructure/service/fileUpload";
import { UseUpdateProfileRequest, UseUpdateProfileResponse } from "../../infrastructure/dtos/user.dto";

export interface UserUpdateUserProfileImageRequest {
    userId: User["_id"];
    file: Express.Multer.File
}

export class UserUpdateUserProfileImageUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private fileDeleteService: FileDeleteService,
        private fileUploadService: FileUploadService,
        private signedUrlService: SignedUrlService
    ) { }

    async execute(data: UserUpdateUserProfileImageRequest): Promise<ApiResponse<{ profileImage: string }>> {
        try {
            const { userId, file } = data;
            if (!userId || !file) throw new Error("Invalid request.");

            const isValidFile = validateFile(file);
            if (!isValidFile) throw new Error("Invalid profile image file");

            const user = await this.userRepositoryImpl.findUserById(userId);
            if (!user) throw new Error("User not found.");

            let profileImageUrl: string = "";
            if (user.profileImage) {
                const response = await this.fileDeleteService.deleteFile(user.profileImage);
                if (!response) throw new Error("Profile image updating failed");
            } else {
                profileImageUrl = await this.fileUploadService.uploadFile({
                    folder: "ss-hr-users-profileImage",
                    userId: "user",
                    file: file,
                });
            }

            const updatedUser = await this.userRepositoryImpl.updateUser({
                ...user,
                profileImage: profileImageUrl
            });
            if (!updatedUser) throw new Error("profile image updating failed");

            const signedUrl = await this.signedUrlService.generateSignedUrl(
                updatedUser.profileImage
            );

            return {
                success: true,
                message: "Profile image updated",
                data: {
                    profileImage: signedUrl
                }
            };
        } catch (error) {
            console.log("UserUpdateUserProfileImageUseCase error : ", error);
            throw handleUseCaseError(error || "Failed to get testimonials");
        }
    }

}


export class UserUpdatePorifleDataUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl
    ) { }

    async execute(data: UseUpdateProfileRequest): Promise<ApiResponse<UseUpdateProfileResponse>> {
        try {
            const { _id, dob, fullName, gender, nationality, phone, phoneTwo, linkedInUrl, portfolioUrl } = data;

            const user = await this.userRepositoryImpl.findUserById(_id);
            if (!user) throw new Error("No user found");

            user.fullName = fullName ?? user.fullName;
            user.phone = phone ?? user.phone;
            user.phoneTwo = phoneTwo ?? user.phoneTwo;
            user.gender = gender ?? user.gender;
            user.nationality = nationality ?? user.nationality;
            user.dob = dob ?? user.dob;
            user.linkedInUrl = linkedInUrl ?? user.linkedInUrl;
            user.portfolioUrl = portfolioUrl ?? user.portfolioUrl;

            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if (!updatedUser) throw new Error("User updating failed");

            console.log("updatedUser : ",updatedUser);

            const response: UseUpdateProfileResponse = {
                fullName: updatedUser.fullName,
                phone: updatedUser.phone,
                phoneTwo: updatedUser.phoneTwo,
                gender: updatedUser.gender,
                nationality: updatedUser.nationality,
                dob: updatedUser.dob,
                linkedInUrl: updatedUser.linkedInUrl,
                portfolioUrl: updatedUser.portfolioUrl,
            };

            return { success: true, message: "", data: response };
        }
        catch (error) {
            console.log("UserUpdatePorifleData error : ", error);
            throw handleUseCaseError(error || "Failed to get testimonials");
        }
    }
}
