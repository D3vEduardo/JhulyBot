import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// ? Irei utilizar no futuro ==> import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
    apiKey: "AIzaSyBnkJEyT-_M1mW_MTQowzXLthuNgcB-Owk",
    authDomain: "jhulybot.firebaseapp.com",
    databaseURL: "https://jhulybot-default-rtdb.firebaseio.com",
    projectId: "jhulybot",
    storageBucket: "jhulybot.appspot.com",
    messagingSenderId: "792834499589",
    appId: "1:792834499589:web:119587501a49bf96e3286c",
    measurementId: "G-TMFVFY5YJ2"
};
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// ? Irei utilizar no futuro ==> const analytics = getAnalytics(db);
