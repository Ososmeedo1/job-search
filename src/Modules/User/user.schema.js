import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";

export const addUser = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    recoveryEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    DOB: Joi.date().min('1965-1-1').max('2011-1-1'),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
  }),
  headers: Joi.object({
    ...generalRules.headers
  })
}

export const updateUser = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    recoveryEmail: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}),
    DOB: Joi.date().min('1965-1-1').max('2011-1-1'),
    phone: Joi.string().regex(/^01[0125][0-9]{8}$/)
  }),
  headers: Joi.object({
    ...generalRules.headers
  })
}

export const getSpecificUser = {
  headers: Joi.object({
    userId: generalRules.objectId,
    ...generalRules.headers
  })
}

export const getRecoveryEmails = {
  body: Joi.object({
    recoveryEmail: Joi.string().required().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}})
  }),

  headers: Joi.object({
    ...generalRules.headers
  })
}

export const updatePassword =  {
  body: Joi.object({
    oldPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required(),
    newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required()
  })
}

export const forgetPassword = {
  body: Joi.object({
    email: Joi.string().email({minDomainSegments: 2,tlds: {allow: ['com', 'net']}}).required()
  }),

  headers: Joi.object({
    ...generalRules.headers
  })
}

export const resetPassword = {
  body: Joi.object({
    newPassword: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword'))
  }),

  headers: Joi.object({
    ...generalRules.headers
  })
}