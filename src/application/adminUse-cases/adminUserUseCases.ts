import { ApiResponse } from "../../infrastructure/dtos/common.dts";
import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
import { PasswordHasher } from "../../infrastructure/security/passwordHasher";
import { CreateLocalUserByAdmin } from "../../domain/repositories/IUserRepository";
import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/addressRepositoryImpl";
import { CareerDataRepositoryImpl } from "../../infrastructure/database/careerData/careerDataRepositoryImpl";
import { AdminFetchUserDetailsRequest, AdminFetchUserDetailsResponse } from "../../infrastructure/dtos/admin.dtos";
import {CreateUserByAdminRequest,CreateUserByAdminResponse,UpdateUserRequest,UpdateUserResponse,DeleteUserRequest,GetUserByIdRequest,GetUserByIdResponse} from "../../infrastructure/dtos/user.dto";
import { SignedUrlService } from "../../infrastructure/service/generateSignedUrl";

export class CreateUserByAdminUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
  ) {}

  async execute(
    data: CreateUserByAdminRequest
  ): Promise<CreateUserByAdminResponse> {
    try {
      const { fullName, email, password, role, phone, phoneTwo } = data;

      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser) throw new Error("User already exists with this email");

      const hashedPassword = await PasswordHasher.hashPassword(password);
            
      const createdUser = await this.userRepository.createUser<CreateLocalUserByAdmin>({
        fullName,
        email,
        password: hashedPassword,
        role,
        phone: phone || "",
        phoneTwo: phoneTwo || "",
        isVerified: true,
      });

      return {
        success: true,
        message: "User created successfully",
        user: {
          _id: createdUser._id,
          serialNumber: createdUser.serialNumber,
          fullName: createdUser.fullName,
          email: createdUser.email,
          role: createdUser.role,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to create user");
    }
  }
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(data: UpdateUserRequest): Promise<UpdateUserResponse> {
    try {
      const { _id, ...updateData } = data;

      const existingUser = await this.userRepository.findUserById(_id);
      if (!existingUser) throw new Error("User not found");

      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findUserByEmail(
          updateData.email
        );
        if (emailExists) throw new Error("Email already exists");
      }

      existingUser.fullName = updateData.fullName;
      existingUser.email = updateData.email;
      existingUser.isBlocked = updateData.isBlocked;
      existingUser.isVerified = updateData.isVerified;
      existingUser.isVerified = updateData.isVerified;
      existingUser.phone = updateData.phone;
      existingUser.phoneTwo = updateData.phoneTwo;

      const result = await this.userRepository.updateUser(existingUser);
      if (!result) throw new Error("Failed to update user");

      return {
        success: true,
        message: "User updated successfully",
        user: {
          _id: result._id,
          serialNumber: result.serialNumber,
          fullName: result.fullName,
          email: result.email,
          role: result.role,
          isBlocked: result.isBlocked,
          isVerified: result.isVerified,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to update user");
    }
  }
}

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(data: DeleteUserRequest): Promise<ApiResponse> {
    try {
      const { userId } = data;

      const existingUser = await this.userRepository.findUserById(userId);
      if (!existingUser) throw new Error("User not found");

      const deleted = await this.userRepository.deleteUser(userId);
      if (!deleted) throw new Error("Failed to delete user");

      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to delete user");
    }
  }
}

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    try {
      const { userId } = data;

      const user = await this.userRepository.findUserById(userId);
      if (!user) throw new Error("User not found");

      return {
        success: true,
        message: "User retrieved successfully",
        user: {
          _id: user._id,
          serialNumber: user.serialNumber,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          phoneTwo: user.phoneTwo,
          isBlocked: user.isBlocked,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get user");
    }
  }
}

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(data: { page: number; limit: number }) {
    try {
      const result = await this.userRepository.findAllUsers(data);
      return {
        success: true,
        message: "Users retrieved successfully",
        ...result,
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get users");
    }
  }
}

export class GetUserStatsUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute() {
    try {
      const totalUsers = await this.userRepository.getTotalCount();
      return {
        success: true,
        message: "User stats retrieved successfully",
        stats: { totalUsers },
      };
    } catch (error) {
      throw handleUseCaseError(error || "Failed to get user stats");
    }
  }
}


export class AdminFetchUserDetailsUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private addressRepositoryImpl: AddressRepositoryImpl,
    private careerDataRepositoryImpl: CareerDataRepositoryImpl,
    private signedUrlService: SignedUrlService
  ) { }

  async execute(data: AdminFetchUserDetailsRequest): Promise<ApiResponse<AdminFetchUserDetailsResponse>> {
    try {

      const userData = await this.userRepositoryImpl.findUserById(data._id);
      if(!userData) throw new Error("No user found");

      const address = await this.addressRepositoryImpl.findAddressesByUserId(data._id);
      const careerData = await this.careerDataRepositoryImpl.findCareerDataByUserId(data._id);

      const { _id: userId, password, verificationToken, role, googleId, ...userResult} = userData;

      if(userResult.profileImage) {
        userResult.profileImage = await this.signedUrlService.generateSignedUrl(userResult.profileImage);
      }

      if(userResult.resume) {
        userResult.resume = await this.signedUrlService.generateSignedUrl(userResult.resume);
      }

      const addressResult = address
        ? (({ _id, ...rest }) => rest)(address)
        : null;

      const careerDataResult = careerData
        ? (({ _id, ...rest }) => rest)(careerData)
        : null;

      return {
        success: true,
        message: "User details fetched",
        data : {
          userData: userResult,
          address: addressResult,
          careerData: careerDataResult
        }
      }

    } catch (error) {
      throw handleUseCaseError(error || "Failed to fetch user details");
    }
  }
}