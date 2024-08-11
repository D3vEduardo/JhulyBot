import { Get } from "./cruds/get.js";
import { Set } from "./cruds/set.js";

export * from "./configs/db.js";
export * from "./configs/schema.js";
export const FirebaseCruds = {
    get: Get,
    set: Set,
}