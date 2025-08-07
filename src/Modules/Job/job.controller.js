import Application from "../../../DB/Models/application.model.js";
import Company from "../../../DB/Models/company.model.js";
import Job from "../../../DB/Models/job.model.js";
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";


export const addJob = async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, experience, jobDescription, technicalSkills, softSkills } = req.body;
  const { companyId } = req.params;
  const { user } = req;


  const jobInfo = {
    jobTitle,
    jobLocation,
    workingTime,
    experience,
    jobDescription,
    technicalSkills,
    softSkills: softSkills ? softSkills : null,
    addedBy: user._id,
    company: companyId
  }

  const newJob = await Job.create(jobInfo);

  if (!newJob) {
    return next(new ErrorHandlerClass("Something wrong happend", 500, "job controller", "failed to add job"));
  }

  return res.status(201).json({ message: "job has been added" });
}

export const updateJob = async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, experience, jobDescription, technicalSkills, softSkills } = req.body;
  const { _id } = req.params;

  const searchJob = await Job.findById({ _id });

  if (!searchJob) {
    return next(new ErrorHandlerClass("Job doesn't exit", 404, "job controller"));
  }

  const updatedJobInfo = {
    jobTitle: jobTitle ? jobTitle : searchJob.jobTitle,
    jobLocation: jobLocation ? jobLocation : searchJob.jobLocation,
    workingTime: workingTime ? workingTime : searchJob.workingTime,
    experience: experience ? experience : searchJob.experience,
    jobDescription: jobDescription ? jobDescription : searchJob.jobDescription,
    technicalSkills: technicalSkills ? technicalSkills : searchJob.technicalSkills,
    softSkills: softSkills ? softSkills : searchJob.softSkills
  }

  const updateJobInfo = await Job.updateOne({ _id }, updatedJobInfo);


  if (!updateJobInfo.modifiedCount) {
    return next(new ErrorHandlerClass("Something wrong happend", 500, "job controller", "job was not updated"));
  }

  return res.status(200).json({ message: "Job updated successfully" });

}

export const deleteJob = async (req, res, next) => {
  const { _id } = req.params;

  const searchJob = await Job.findByIdAndDelete({ _id });

  if (!searchJob) {
    return next(new ErrorHandlerClass("Job does not exist", 404))
  }

  return res.status(200).json({ message: "job was deleted successfully" });

}

export const getAllJobs = async (req, res, next) => {
  const allJobs = await Job.find().populate({ path: "company", as: "Company" });

  if (!allJobs.length) {
    return next(new ErrorHandlerClass("No Jobs", 404))
  }

  return res.status(200).json({ message: "done", data: allJobs });
}

export const getAllJobsForSpecificCompany = async (req, res, next) => {
  const { companyName } = req.query;
  const company = await Company.findOne({ companyName });
  const getJobs = await Job.find({ company: company._id });

  if (!getJobs.length) {
    return next(new ErrorHandlerClass("No jobs for this company", 404));
  }

  return res.status(200).json({ message: "done", data: getJobs });
}

export const getFilteredJobs = async (req, res, next) => {

  let filteredQuery = {};

  const filters = ["workingTime", "jobTitle", "jobLocation", "experience", "technicalSkills"];

  for (const filter of filters) {
    if (req.query?.[filter]) {
      if (filter == "experience") {
        filteredQuery[filter] = +(req.query[filter]);
      } else if (filter == "technicalSkills") {
        filteredQuery[filter] = JSON.parse(req.query[filter]);
      }
      else {
        filteredQuery[filter] = req.query[filter];
      }
    }
  }

  const allFilterdJobs = await Job.find(filteredQuery);

  if (!allFilterdJobs.length) {
    return next(new ErrorHandlerClass("No job exists like that", 404));
  }

  return res.status(200).json({message: "done", data: allFilterdJobs});
}

// export const applyToJob = async (req, res, next) => {
//   const {userSoftSkills, userTechSkills, jobId} = req.body;
//   const {user} = req;

//   const job = await Job.findById({_id: jobId});

//   if (!job) {
//     return next(new ErrorHandlerClass("Job does not exist", 404));
//   }

//   const isAppExist = await Application.findOne({userId: user._id, jobId});

//   if (isAppExist) {
//     return next(new ErrorHandlerClass("You have already apllied for this job", 400))
//   }

  
// }