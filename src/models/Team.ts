import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

export const APPROVAL_STATES = ['Pending', 'Approved', 'Not Approved'] as const;
export type ApprovalState = typeof APPROVAL_STATES[number];

const MemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    contact: { type: String, required: true, trim: true },
  },
  { _id: false, timestamps: false }
);

const TeamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    managerApproval: {
      type: String,
      enum: APPROVAL_STATES,
      default: 'Pending',
      required: true,
    },
    directorApproval: {
      type: String,
      enum: APPROVAL_STATES,
      default: 'Pending',
      required: true,
    },
    members: { type: [MemberSchema], default: [], required: true },
  },
  { timestamps: true }
);

export type Member = InferSchemaType<typeof MemberSchema>;
export type Team = InferSchemaType<typeof TeamSchema> & { _id: mongoose.Types.ObjectId };

export const TeamModel = models.Team || model('Team', TeamSchema);


