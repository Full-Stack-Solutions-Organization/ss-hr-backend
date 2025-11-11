import z, { email } from "zod";
import { enumField } from "./zodUtilities";
import { Role } from "../../domain/entities/user";
import { fullName, limitedRole, password, phone } from "./common.zod";

// admin create new admin zod schema
export const createAdminZodSchema = z.object({
    fullName,
    email,
    password,
    phone,
    role: limitedRole,
    createrRole: enumField("creatorRole", [Role.SuperAdmin, Role.SystemAdmin])
});
