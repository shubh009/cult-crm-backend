import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    priceRange: { type: String, trim: true }, // e.g. "50L - 2Cr"
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["active", "completed", "upcoming", "on_hold"],
      default: "active",
      index: true,
    },
    launchDate: { type: Date },
    possessionDate: { type: Date },
    amenities: [{ type: String }], // e.g. ["Gym", "Swimming Pool"]
    configurations: [
      {
        type: { type: String, trim: true }, // e.g. "2BHK", "3BHK"
        size: { type: String, trim: true }, // e.g. "1200 sqft"
        price: { type: Number }, // optional numeric price
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Text index for searching
projectSchema.index({ name: "text", location: "text", description: "text" });

const Project = mongoose.model("Project", projectSchema);

export default Project;
