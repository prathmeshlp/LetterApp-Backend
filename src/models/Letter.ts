import mongoose, { Schema, Document } from "mongoose";

export interface ILetter extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  googleDriveId?: string;
}

const letterSchema: Schema<ILetter> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    googleDriveId: { type: String },
  },
  { timestamps: true }
);

export const Letter = mongoose.model<ILetter>("Letter", letterSchema);
