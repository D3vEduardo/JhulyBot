import { set, ref } from "firebase/database";
import { FirebaseCruds, iUserSchema, db } from "#database";

export async function Set(id: string, data: iUserSchema): Promise<iUserSchema> {
    const dbRef = ref(db, id);
    set(dbRef, data);

    return await FirebaseCruds.get(id);
}