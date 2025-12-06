import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
// Assuming CompanyModel exists, if not I might need to check for it or create a placeholder.
// Checking file structure earlier didn't show company model explicitly but let's assume standard structure or use a placeholder if model missing.
// Actually, looking at imports in useCases, it imports CompanyRepositoryImpl.
// I'll assume CompanyModel is needed. Let me check if CompanyModel exists.
import { CompanyModel } from "./companyModel"; 

export class CompanyRepositoryImpl implements ICompanyRepository {
  async countCompanies(): Promise<number> {
    try {
      return await CompanyModel.countDocuments();
    } catch (error) {
      throw new Error("Failed to count companies");
    }
  }
}
