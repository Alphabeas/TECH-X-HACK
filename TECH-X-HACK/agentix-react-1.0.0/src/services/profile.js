import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function getUserProfile(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

export async function saveUserProfile(uid, data) {
    const ref = doc(db, "users", uid);
    await setDoc(
        ref,
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function getUserLatestAnalysis(uid) {
    const profile = await getUserProfile(uid);
    return profile?.latestAnalysis || null;
}

export async function saveUserLatestAnalysis(uid, analysis) {
    await saveUserProfile(uid, { latestAnalysis: analysis });
}
