import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { UserUpdateUserProfileImageRequest, UserUpdateUserResumeRequest, UseUpdateProfileRequest, UseUpdateProfileResponse } from "../../infrastructure/dtos/user.dto";

export class UserUpdateUserProfileImageUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
    ) { }

    async execute(data: UserUpdateUserProfileImageRequest): Promise<ApiResponse<{ profileImage: string }>> {
        try {
            const user = await this.userRepositoryImpl.findUserById(data._id);
            if (!user) throw new Error("No user found");

            user.profileImage = data.profileImage;

            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if(!updatedUser) throw new Error("Failed to update profile image data");

            return { success: true, message: "Profile image updated" };
        } catch (error) {
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
            const { _id, dob, fullName, gender, nationality, phone, linkedInUsername, professionalStatus } = data;

            const user = await this.userRepositoryImpl.findUserById(_id);
            if (!user) throw new Error("No user found");

            user.fullName = fullName ?? user.fullName;
            user.phone = phone ?? user.phone;
            user.gender = gender ?? user.gender;
            user.nationality = nationality ?? user.nationality;
            user.dob = dob ?? user.dob;
            user.linkedInUsername = linkedInUsername ?? user.linkedInUsername;
            user.professionalStatus = professionalStatus ?? user.professionalStatus;

            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if (!updatedUser) throw new Error("User updating failed");

            const response: UseUpdateProfileResponse = {
                fullName: updatedUser.fullName,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                nationality: updatedUser.nationality,
                dob: updatedUser.dob,
                linkedInUsername: updatedUser.linkedInUsername,
                professionalStatus: updatedUser.professionalStatus,
            };

            return { success: true, message: "", data: response };
        }
        catch (error) {
            throw handleUseCaseError(error || "Failed to get testimonials");
        }
    }
}


export class UserUpdateResumeKeyUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl
    ) { }

    async execute(data: UserUpdateUserResumeRequest):Promise<ApiResponse> {
        try {

            const user = await this.userRepositoryImpl.findUserById(data._id);
            if (!user) throw new Error("No user found");

            user.resume = data.resume;

            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if(!updatedUser) throw new Error("Failed to update file data");

            return { success: true, message: "Resume updated" };
        } catch (error) {
            throw handleUseCaseError(error || "Failed to update resume");
        }
    }
}