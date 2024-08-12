import { set, ref } from "firebase/database";
import { FirebaseCruds, db } from "#database";
export async function Set(id, data) {
    const dbRef = ref(db, id);
    set(dbRef, data);
    return await FirebaseCruds.get(id);
}
