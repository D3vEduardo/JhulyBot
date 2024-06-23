import mongoose, { InferSchemaType, model } from "mongoose";
import { userSchema } from "./schemas/user.js";
import { log } from "#settings";
import chalk from "chalk";

try {
   const mongodb = await mongoose.connect(process.env.MONGO_URI, { dbName: "database" });
   log.success(chalk.green("MongoDB connected"));
} catch(err){
   log.error(err);
   process.exit(1);
}

export const db = {
   users: model("user", userSchema, "users")
};

export type MemberSchema = InferSchemaType<typeof userSchema>;