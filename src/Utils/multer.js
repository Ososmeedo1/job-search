import multer from "multer"
import { ErrorHandlerClass } from "./error-class.utils.js";



export const filteration = {
  file: ["application/pdf", "application/msword"]
}

export const uploadFile = (filter) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (filter.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ErrorHandlerClass("Invalid file format", 400), false)
    }
  }

  const upload = multer({storage, fileFilter});
  return upload;
}