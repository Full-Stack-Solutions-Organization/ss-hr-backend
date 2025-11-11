import { Types } from "mongoose";
import { IJob, JobModel } from "./jobModel";
import { Job } from "../../../domain/entities/job";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dts";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { UserFetchAllJobsResponse, UserFetchJobDetailsResponse } from "../../dtos/user.dto";
import { AdminCreateNewJob, AdminFetchAllJobs, AdminFetchJobDetailsResponse } from "../../dtos/adminJob.dtos";

export class JobRepositoryImpl implements IJobRepository {

  private mapToEntity(job: IJob): Job {
    return new Job(
      job._id,
      job.companyName,
      job.industry,
      job.designation,
      job.vacancy,
      job.salary,
      job.benifits,
      job.skills,
      job.jobDescription,
      job.nationality,
      job.createdAt,
      job.updatedAt,
    );
  }

  async createJob(payload: AdminCreateNewJob): Promise<Job | null> {
    try {
      const newJob = await JobModel.create(payload);
      return newJob ? this.mapToEntity(newJob) : null;
    } catch (error) {
      throw new Error("Unable to create job, please try again.");
    }
  }

  async adminFindAllJobs({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllJobs>> {
    try {
      const adminGetAllJobsProject = {
        _id: 1, 
        companyName: 1,
        industry: 1,
        vacancy: 1,
        designation: 1,
        salary: 1,
        createdAt: 1
      };

      const project = adminGetAllJobsProject;
      const skip = (page - 1) * limit;

      const [jobs, totalCount] = await Promise.all([
        JobModel.find({}, project).skip(skip).limit(limit).lean(),
        JobModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: jobs.map(job => ({
          _id: job._id,
          companyName: job.companyName,
          industry: job.industry,
          designation: job.designation,
          salary: job.salary,
          vacancy: job.vacancy,
          createdAt: job.createdAt,
        })),
        totalPages,
        currentPage: page,
        totalCount
      };
    } catch (error) {
      throw new Error("Failed to fetch jobs from database.");
    }
  }


  async findJobById(jobId: Types.ObjectId, admin: boolean): Promise<AdminFetchJobDetailsResponse | UserFetchJobDetailsResponse | null> {
    try {
      const adminGetAllJobsProject = {
        _id: 1,
        companyName: 1,
        industry: 1,
        designation: 1,
        vacancy: 1,
        salary: 1,
        benifits: 1,
        skills: 1,
        jobDescription: 1,
        nationality: 1,
        createdAt: 1
      };

      const userGetAllJobsProject = {
        _id: 1,
        industry: 1,
        designation: 1,
        vacancy: 1,
        salary: 1,
        benifits: 1,
        skills: 1,
        jobDescription: 1,
        nationality: 1,
        createdAt: 1
      };
      const project = admin ? adminGetAllJobsProject : userGetAllJobsProject;
      const job = await JobModel.findById(jobId, project);
      return job ? this.mapToEntity(job) : null;
    } catch (error) {
      throw new Error("Job not found.");
    }
  }

  async userFindAllJobs({ page, limit }: ApiPaginationRequest, userId: Types.ObjectId): Promise<ApiResponse<UserFetchAllJobsResponse>> {
    try {
      const [jobs, totalCount] = await Promise.all([
        JobModel.aggregate([
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "applications",
              let: { jobId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$jobId", "$$jobId"] },
                        { $eq: ["$userId", userId] }
                      ]
                    }
                  }
                }
              ],
              as: "userApplications"
            }
          },
          {
            $addFields: {
              applied: { $gt: [{ $size: "$userApplications" }, 0] }
            }
          },
          {
            $project: {
              _id: 1, salary: 1, designation: 1, vacancy: 1, createdAt: 1,
              applied: 1
            }
          }
        ]),
        JobModel.countDocuments()]);
      const totalPages = Math.ceil(totalCount / limit);
      return {
        data: jobs.map(job => ({
          _id: job._id,
          salary: job.salary,
          designation: job.designation,
          vacancy: job.vacancy,
          createdAt: job.createdAt,
          applied: job.applied,
        })),
        totalPages,
        currentPage: page,
        totalCount
      };
    } catch (error) {
      throw new Error("Failed to fetch jobs");
    }
  }


  async updateJob(jobId: Types.ObjectId, updatedData: Partial<AdminCreateNewJob>): Promise<Job | null> {
    try {
      const updatedJob = await JobModel.findByIdAndUpdate({ _id: jobId }, updatedData, { new: true });
      return updatedJob ? this.mapToEntity(updatedJob) : null;
    } catch (error) {
      throw new Error("Unable to update job.");
    }
  }

  async deleteJob(jobId: Types.ObjectId): Promise<boolean> {
    try {
      const result = await JobModel.findByIdAndDelete(jobId);
      return !!result;
    } catch (error) {
      throw new Error("Unable to delete job.");
    }
  }

  // async getTotalCount(): Promise<number> {
  //   try {
  //     return await JobModel.countDocuments({});
  //   } catch (error) {
  //     throw new Error("Failed to get total job count.");
  //   }
  // }

  // async findJobsByCompanyName(companyName: string): Promise<Job[]> {
  //   try {
  //     const jobs = await JobModel.find({ companyName });
  //     return jobs.map(job => this.mapToEntity(job));
  //   } catch (error) {
  //     throw new Error("Unable to find jobs by company name.");
  //   }
  // }
}