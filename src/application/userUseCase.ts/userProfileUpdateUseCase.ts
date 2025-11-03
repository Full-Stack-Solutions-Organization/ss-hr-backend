import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { UseUpdateProfileRequest, UseUpdateProfileResponse } from "../../infrastructure/dtos/user.dto";

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
