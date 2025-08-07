import Joi from 'joi'
import { generalRules } from '../../Utils/general-rules.utils.js'


export const addJob = {
  body: Joi.object({
    jobTitle: Joi.string().min(3).max(20).required(),
    jobLocation: Joi.string().valid('onsite', 'remotley', 'hybrid').required(),
    workingTime: Joi.string().valid('part-time', 'full-time').required(),
    experience: Joi.number().min(0).max(30).required(),
    jobDescription: Joi.string().min(10).max(1000).required(),
    technicalSkills: Joi.array().min(1).max(100).required(),
    softSkills: Joi.array().min(1).max(50).optional(),
  }),

  headers: Joi.object({
    ...generalRules.headers
  }),

  params: Joi.object({
    companyId: generalRules.objectId
  })
}

export const updateJob = {
  body: Joi.object({
    jobTitle: Joi.string().min(3).max(20).optional(),
    jobLocation: Joi.string().valid('onsite', 'remotley', 'hybrid').optional(),
    workingTime: Joi.string().valid('part-time', 'full-time').optional(),
    experience: Joi.number().min(0).max(30).optional(),
    jobDescription: Joi.string().min(10).max(1000).optional(),
    technicalSkills: Joi.array().min(1).max(100).optional(),
    softSkills: Joi.array().min(1).max(50).optional(),
  }),

  headers: Joi.object({
    ...generalRules.headers
  }),

  params: Joi.object({
    _id: generalRules.objectId
  })
}

export const deleteJob = {
  headers: Joi.object({
    ...generalRules.headers
  }),

  params: Joi.object({
    _id: generalRules.objectId
  })
}

export const allJobs = {
  headers: Joi.object({
    ...generalRules.headers
  }),
}

export const getAllJobsForSpecificCompany = {
  headers: Joi.object({
    ...generalRules.headers
  }),

  query: Joi.object({
    companyName: Joi.string().min(3).max(20).required()
  })
}

export const getAllFilterdJobs = {
  query: Joi.object({
    jobTitle: Joi.string().min(3).max(20).optional(),
    jobLocation: Joi.string().valid('onsite', 'remotley', 'hybrid').optional(),
    workingTime: Joi.string().valid('part-time', 'full-time').optional(),
    experience: Joi.number().min(0).max(30).optional(),
    technicalSkills: Joi.array().min(1).max(100).optional()
  }),

  headers: Joi.object({
    ...generalRules.headers
  }),
}