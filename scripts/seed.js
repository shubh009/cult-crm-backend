import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { Lead } from "../src/models/Lead.js";
import User from "../src/models/User.js";
import Project from "../src/models/Project.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cultcrm";

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🧹 Clearing old data...");
    await Promise.all([Lead.deleteMany({}), User.deleteMany({}), Project.deleteMany({})]);

    console.log("👤 Creating users...");
    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@cultcrm.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        name: "Sales Executive",
        email: "sales@cultcrm.com",
        password: await bcrypt.hash("sales123", 10),
        role: "sales",
      },
    ]);

    console.log("🏗️ Creating projects...");
    const projects = await Project.insertMany([
      {
        name: "Luxury Heights",
        location: "Agra",
        priceRange: "50L - 2Cr",
        description: "Luxury apartments with world-class amenities",
        status: "active",
        amenities: ["Gym", "Swimming Pool", "Clubhouse"],
        configurations: [
          { type: "2BHK", size: "1200 sqft", price: 5000000 },
          { type: "3BHK", size: "1600 sqft", price: 7500000 },
        ],
        createdBy: users[0]._id,
      },
      {
        name: "Green Valley",
        location: "Delhi NCR",
        priceRange: "40L - 1.5Cr",
        description: "Eco-friendly housing project",
        status: "upcoming",
        amenities: ["Park", "Yoga Area", "Walking Track"],
        configurations: [{ type: "2BHK", size: "1000 sqft", price: 4000000 }],
        createdBy: users[0]._id,
      },
    ]);

    console.log("📋 Creating leads...");
    await Lead.insertMany([
      {
        name: "Ravi Kumar",
        email: "ravi@example.com",
        contact: "9876543210",
        city: "Agra",
        source: "website",
        status: "new",
        assignedTo: users[1]._id,
        project: projects[0]._id,
        requirements: "Looking for 2BHK flat near market",
        LeadcreatedBy: users[0]._id,
      },
      {
        name: "Anita Sharma",
        email: "anita@example.com",
        contact: "9123456780",
        city: "Delhi",
        source: "facebook",
        status: "contacted",
        assignedTo: users[1]._id,
        project: projects[1]._id,
        requirements: "Interested in eco-friendly homes",
        LeadcreatedBy: users[0]._id,
      },
    ]);

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
