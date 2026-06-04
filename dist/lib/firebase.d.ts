export declare const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};
export declare const isDemoMode = true;
declare const app: import("@firebase/app").FirebaseApp;
declare const db: import("@firebase/firestore").Firestore;
declare const auth: import("@firebase/auth").Auth;
declare const storage: import("@firebase/storage").FirebaseStorage;
declare let dataConnect: unknown;
export declare const initAnalytics: () => Promise<import("@firebase/analytics").Analytics | null>;
export declare const initMessaging: () => Promise<import("@firebase/messaging").Messaging | null>;
export { app, db, auth, storage, dataConnect };
//# sourceMappingURL=firebase.d.ts.map