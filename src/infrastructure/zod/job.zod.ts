import { z } from "zod";
import { benifits, companyName, designation, industry, jobDescription, nationality, salary, skills, vacancy } from "./common.zod";

// admin create job zod schema
export const createJobZodSchema = z.object({
  salary,
  skills,
  industry,
  benifits,
  vacancy,
  companyName,
  designation,
  nationality,
  jobDescription,
});

// admin update job zod schema
export const updateJobZodSchema = z.object({
  salary: salary.optional(),
  skills: skills.optional(),
  industry: industry.optional(),
  benifits: benifits.optional(),
  vacancy: vacancy.optional(),
  companyName: companyName.optional(),
  designation: designation.optional(),
  nationality: nationality.optional(),
  jobDescription: jobDescription.optional(),
});