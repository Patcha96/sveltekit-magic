// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable, type Readable } from "svelte/store";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcpwTnN92pJF9v4fMbUXcPoELriZqYkvg",
  authDomain: "sveltekit-magic.firebaseapp.com",
  projectId: "sveltekit-magic",
  storageBucket: "sveltekit-magic.appspot.com",
  messagingSenderId: "966958537134",
  appId: "1:966958537134:web:7c0f099be29a6cbe9d503f",
  measurementId: "G-Q4SV1PRYV9",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  // sets store to null when client sdk is not avaialble
  // like when rendered on the server
  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  // Creates new writable store and destructure its built in subscribe method
  // Default value currentUser or null
  // callback containing set function, that allows to change value of store
  // updates current user in the svelte store whenever value changes
  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });
    // calls unsubscribe when the store no longer has any
    // subscribers by returning it in body of the function
    // to unsubscribe from auth, especially important when
    // dealing with firestore database data
    return () => unsubscribe();
  });
  return {
    subscribe,
  };
}

export const user = userStore();

/**
 * @param {string} path document path or reference
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(path: string) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

interface UserData {
  username: string;
  bio: string;
  photoURL: string;
  links: any[];
}

export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  }
);
