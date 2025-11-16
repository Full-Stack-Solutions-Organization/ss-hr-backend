import { z } from "zod";
import { benifits, companyName, designation, industry, jobDescription, nationality, salary, skills, vacancy } from "./common.zod";

// admin create job zod schema
export const createJobZodSchema = z.object({
  companyName,
  designation,
  industry,
  jobDescription,
  benifits,
  salary,
  skills,
  nationality,
  vacancy,
});