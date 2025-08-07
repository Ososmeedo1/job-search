import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";


export const addCompany = {
  body: Joi.object({
    companyName: Joi.string().min(3).max(20).required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numOfEmployees: Joi.object({
      from: Joi.number().min(1).max(3000).required(),
      to: Joi.number().min(2).max(10000).required()
    }),
    companyEmail: Joi.string().required().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    company_hr: generalRules.objectId
  }),

  headers: Joi.object({
    ...generalRules.headers
  })
}

export const updateCompany = {
  body: Joi.object({
    companyName: Joi.string().min(3).max(20),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numOfEmployees: Joi.object({
      from: Joi.number().min(1).max(3000),
      to: Joi.number().min(2).max(10000)
    }),
    companyEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}})
  }),

  headers: Joi.object({
    ...generalRules.headers
  })
}