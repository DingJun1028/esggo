declare module 'firebase/firestore' {
  export const collection: any;
  export const doc: any;
  export const getDoc: any;
  export const getDocs: any;
  export const addDoc: any;
  export const updateDoc: any;
  export const deleteDoc: any;
  export const query: any;
  export const where: any;
  export const serverTimestamp: any;
  export const Timestamp: any;
  export const setDoc: any;
}
declare module 'firebase/messaging' {
  export const getMessaging: any;
  export const getToken: any;
  export const onMessage: any;
  export const isSupported: any;
}
declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: any;
    providerData: any[];
    refreshToken: string;
    tenantId: string | null;
    delete(): Promise<void>;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<any>;
    reload(): Promise<void>;
    toJSON(): object;
  }
  export const getAuth: any;
  export const onAuthStateChanged: any;
  export const signInWithEmailAndPassword: any;
  export const signOut: any;
  export const createUserWithEmailAndPassword: any;
  export const GoogleAuthProvider: any;
  export const signInWithPopup: any;
}
declare module 'firebase/functions' {
  export const getFunctions: any;
  export const httpsCallable: any;
}
declare module 'snarkjs' {
  export const groth16: any;
}
