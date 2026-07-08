const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./src/models/User");

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Admin User";
const ADMIN_ROLE = "admin";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin user already exists:`);
      console.log(`  Email: ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
      console.log(`  Role: ${existing.role}`);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: ADMIN_ROLE,
    });

    console.log("Admin user created successfully!");
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  Role: ${admin.role}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
