import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

export const firebaseSignOut = () => signOut(getAuth(firebase));
export const useUserState = () => {
    const auth = getAuth(firebase);
    return useAuthState(auth);
};

export const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [snapshot, loading, error] = useObject(ref(database, path));
    let data;
    if (snapshot) {
        const value = snapshot.val();
        data = !loading && !error && transform ? transform(value) : value;
    }

    return [data, loading, error];
};

export const setData = (path, value) => {
    console.log(path);
    console.log(value);
    set(ref(database, path), value)
};