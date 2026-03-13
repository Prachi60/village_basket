import mongoose from "mongoose";
import HeaderCategory from "./src/models/HeaderCategory";
import dotenv from "dotenv";


dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ApnaSabjiWala";

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        let home = await HeaderCategory.findOne({ slug: "all" });
        if (!home) {
            home = new HeaderCategory({
                name: "HOME",
                slug: "all",
                status: "Published",
                order: -1
            });
            await home.save();
            console.log("Created HOME category");
        } else {
            home.name = "HOME";
            await home.save();
            console.log("HOME category exists");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error seeding home category:", error);
        process.exit(1);
    }
}

seed();
