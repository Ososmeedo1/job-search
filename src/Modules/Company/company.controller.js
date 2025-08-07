import Company from "../../../DB/Models/company.model.js";
import { ErrorHandlerClass } from "../../Utils/error-class.utils.js";




export const addCompany = async (req, res, next) => {
  const { companyName, description, industry, address, numOfEmployees, companyEmail } = req.body;
  const { user } = req;

  const companyInfo = {
    companyName,
    description,
    industry,
    address,
    numOfEmployees,
    companyEmail,
    company_hr: user._id
  }

  const newCompany = await Company.create(companyInfo);

  if (!newCompany) {
    return next(new ErrorHandlerClass("Company was not added", 500))
  }

  return res.status(201).json({ message: "Company was added" });

}

export const updateCompany = async (req, res, next) => {
  const { companyName, description, industry, address, numOfEmployees, companyEmail } = req.body;
  const { id } = req.params;
  const { user } = req;

  const isCompanyExist = await Company.findOne({ _id: id, company_hr: user._id });

  if (!isCompanyExist) {
    return next(new ErrorHandlerClass("Company not found"))
  }

  const isCompanyDuplicated = await Company.find({ $or: [{ companyName }, { companyEmail }] });

  console.log(isCompanyDuplicated);


  if (isCompanyDuplicated.length) {
    return next(new ErrorHandlerClass("Company Name or Company Email is duplicated", 500));
  }

  const updatedCompanyInfo = {
    companyName: companyName ? companyName : isCompanyExist.companyName,
    description: description ? description : isCompanyExist.description,
    industry: industry ? industry : isCompanyExist.industry,
    address: address ? address : isCompanyExist.address,
    numOfEmployees: numOfEmployees ? numOfEmployees : isCompanyExist.numOfEmployees,
    companyEmail: companyEmail ? companyEmail : isCompanyExist.companyEmail
  }

  const updateCompany = await Company.updateOne({ _id: id }, updatedCompanyInfo);

  if (updateCompany.modifiedCount) {
    return res.status(200).json({ message: "done" });
  }

  return next(ErrorHandlerClass("Something wrong happened", 500))

}

export const deleteCompany = async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const deleteCompany = await Company.deleteOne({ _id: id, company_hr: user._id });

  if (!deleteCompany.deletedCount) {
    return next(new ErrorHandlerClass("Company not found", 404))
  }

  return res.status(200).json({ message: "Company has been deleted" });

}

export const getCompanyData = async (req, res, next) => {
  const {id} = req.params;

  const companyData = await Company.find({_id: id});
  
}