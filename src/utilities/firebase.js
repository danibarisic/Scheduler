import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useDatabaseValue } from "@react-query-firebase/database";

export const firebaseConfig = {
    apiKey: "AIzaSyC3uDDj6NUQHZBT6AZODStmidUswrhOfg4",
    authDomain: "northside-youth-soccer-l-7cd46.firebaseapp.com",
    databaseURL: "https://northside-youth-soccer-l-7cd46-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "northside-youth-soccer-l-7cd46",
    storageBucket: "northside-youth-soccer-l-7cd46.firebasestorage.app",
    messagingSenderId: "404408397480",
    appId: "1:404408397480:web:1a7b992ecdc55478689c9d",
    measurementId: "G-L2754064B4"
};

export const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const { data, isLoading, error } = useDatabaseValue([path], ref(database, path), { subscribe: true });
    const value = (!isLoading && !error && transform) ? transform(data) : data;

    return [value, isLoading, error];
};