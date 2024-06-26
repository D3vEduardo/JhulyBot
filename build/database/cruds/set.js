import { db } from "database/configs/db.js";
import { set, ref } from "firebase/database";
import { FirebaseGet } from "#database";
export async function FirebaseSet(id, data) {
    const dbRef = ref(db, id);
    set(dbRef, data);
    return await FirebaseGet(id);
}
