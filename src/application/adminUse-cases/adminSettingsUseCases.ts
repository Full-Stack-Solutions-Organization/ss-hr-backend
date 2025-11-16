// import { Types } from "mongoose";
// import { User } from "../../domain/entities/user";
// import { LimitedRole } from "../../infrastructure/zod/common.zod";
// import { CreateAdmin } from "../../domain/repositories/IUserRepository";
// import { handleUseCaseError } from "../../infrastructure/error/useCaseError";
// import { PasswordHasher } from "../../infrastructure/security/passwordHasher";
// import { AdminFetchAllAdmins } from "../../domain/repositories/IUserRepository";
// import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dts";
// import { UserRepositoryImpl } from "../../infrastructure/database/user/userRepositoryImpl";
// import { CreateAdminRequest, CreateAdminResponse } from "../../infrastructure/dtos/admin.dtos";

// export class CreateAdminUseCase {
//     constructor(
//         private userRepositoryImpl: UserRepositoryImpl,
//     ) { }

//     async execute(payload: CreateAdminRequest): Promise<ApiResponse<CreateAdminResponse>> {
//         try {

//             let hashedPassword: string = await PasswordHasher.hashPassword(payload.password);

//             const createdAdmin = await this.userRepositoryImpl.createUser<CreateAdmin>({
//                 ...payload,
//                 password: hashedPassword,
//                 isVerified: true,
//             });

//             const { phoneTwo, isVerified, verificationToken, googleId, updatedAt, password: adminPassword, ...newAdmin } = createdAdmin;

//             return { success: true, message: "New admin created", data: { ...newAdmin } }
//         } catch (error) {
//             throw handleUseCaseError(error || "Unexpected error in verifying otp");
//         }
//     }
// }


// export class DeleteAdminUseCase {
//     constructor(
//         private userRepositoryImpl: UserRepositoryImpl,
//     ) { }

//     async execute(requesterRole: User["role"], adminId: Types.ObjectId): Promise<ApiResponse> {
//         try {

//             if (!adminId || !requesterRole) throw new Error("Invalid request");

//             const targetAdmin = await this.userRepositoryImpl.findUserById(adminId);
//             if (!targetAdmin) {
//                 throw new Error("Admin not found");
//             }

//             if (requesterRole === LimitedRole.User || requesterRole === LimitedRole.Admin) {
//                 throw new Error("You do not have permission to delete other users.");
//             }

//             const response = await this.userRepositoryImpl.deleteUserById(adminId);
//             if (!response) throw new Error("Admin deleting failed");

//             return { success: true, message: 'Admin deleted successfully' };
//         } catch (error) {
//             throw handleUseCaseError(error || "Unexpected error in deleting admin");
//         }
//     }
// }

// export class AdminGetAllAdminsUseCase {
//     constructor(
//         private userRepositoryImpl: UserRepositoryImpl
//     ) { }

//     async execute(payload: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllAdmins>> {
//         try {
//             const admins = await this.userRepositoryImpl.findAllAdmins(payload);
//             if(!admins) throw new Error("No admins found in databse");

//             return { success: true, message: "Fetched all admins", data: admins as AdminFetchAllAdmins }
//         } catch (error) {
//             throw handleUseCaseError(error || "Unexpected error in AdminGetAllAdminsUseCase");
//         }
//     }
// }