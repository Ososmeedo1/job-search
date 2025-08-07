import mongoose from "mongoose";

const {Schema, model, Types, models} = mongoose;

const applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    userTechSkills: {
      type: [String],
      required: true
    },
    userSoftSkills: {
      type: [String],
      required: true
    },
    userResume: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Application = models.Application || model('Application', applicationSchema);

export default Application;