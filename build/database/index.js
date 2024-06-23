import { model } from "mongoose";
import { userSchema } from "./schemas/user.js";
import { log } from "#settings";
import chalk from "chalk";
try {
    log.success(chalk.green("MongoDB connected"));
}
catch (err) {
    log.error(err);
    process.exit(1);
}
export const db = {
    users: model("user", userSchema, "users")
};
