import { db, UserSchema } from "#database";
import { ref, get, set } from "firebase/database";
export async function FirebaseGet(id) {
    const dbRef = ref(db, id);
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) {
        await set(dbRef, UserSchema);
        return await FirebaseGet(id);
    }
    ;
    return snapshot.val();
}
