import { Router } from "express";
import { auth } from "../../Middlewares/auth.middleware.js";
import * as jobController from './job.controller.js';
import * as jobSchema from './job.schema.js'; 
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";

const router = Router();

router.post('/add/:companyId', auth('Company_HR'), validationMiddleware(jobSchema.addJob), errorHandle(jobController.addJob));
router.put('/update/:_id', auth('Company_HR'), validationMiddleware(jobSchema.updateJob), errorHandle(jobController.updateJob));
router.delete('/delete/:_id', auth('Company_HR'), validationMiddleware(jobSchema.deleteJob), errorHandle(jobController.deleteJob));
router.get('/all', auth(['User', 'Company_HR']), validationMiddleware(jobSchema.allJobs), errorHandle(jobController.getAllJobs));
router.get('/specific', auth(['User', 'Company_HR']), validationMiddleware(jobSchema.getAllJobsForSpecificCompany), errorHandle(jobController.getAllJobsForSpecificCompany));
router.get('/filter', auth(["User", "Company_HR"]), validationMiddleware(jobSchema.getAllFilterdJobs), errorHandle(jobController.getFilteredJobs));

export default router;