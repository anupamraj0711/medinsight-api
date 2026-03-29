/*
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

export default mongoose.model("User", userSchema);
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // 🔥 ADD THIS
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient"
  }
});

export default mongoose.model("User", userSchema);