"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataConnect = exports.storage = exports.auth = exports.db = exports.app = exports.initMessaging = exports.initAnalytics = exports.isDemoMode = exports.firebaseConfig = void 0;
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const storage_1 = require("firebase/storage");
// Your web app's Firebase configuration
exports.firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fake-auth-domain',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fake-storage-bucket',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-ABCDEF'
};
exports.isDemoMode = true; // Forced true for local CLI testing
// Initialize Firebase
const app = (0, app_1.getApps)().length > 0 ? (0, app_1.getApp)() : (0, app_1.initializeApp)(exports.firebaseConfig);
exports.app = app;
// Initialize free Firebase services
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
// Data Connect (Optional based on generated code)
let dataConnect = null;
exports.dataConnect = dataConnect;
// 使用非阻塞方式異步初始化 Data Connect
(async () => {
    try {
        const { getDataConnect, connectDataConnectEmulator } = await Promise.resolve().then(() => __importStar(require("firebase/data-connect")));
        // @ts-expect-error - may not be generated yet
        const { connectorConfig } = await Promise.resolve().then(() => __importStar(require("@dataconnect/generated")));
        if (connectorConfig) {
            exports.dataConnect = dataConnect = getDataConnect(connectorConfig);
            // Connect to emulator if host is provided
            if (process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST) {
                const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_DATACONNECT_EMULATOR_HOST.split(':');
                // @ts-expect-error - Data Connect types may not be available yet
                connectDataConnectEmulator(dataConnect, host, parseInt(port));
                console.log(`Firebase Data Connect: Connected to emulator at ${host}:${port}`);
            }
        }
    }
    catch (_e) {
        // Data Connect not yet generated or supported
        console.log("Firebase Data Connect not initialized: Code not yet generated.");
    }
})();
const initAnalytics = async () => {
    if (exports.firebaseConfig.apiKey === 'fake-api-key' || !exports.firebaseConfig.apiKey) {
        console.warn("Skipping Firebase Analytics because API key is missing or fake (to prevent Next.js Error Overlay).");
        return null;
    }
    if (typeof window !== "undefined") {
        try {
            const supported = await (0, analytics_1.isSupported)();
            if (supported) {
                return (0, analytics_1.getAnalytics)(app);
            }
        }
        catch (e) {
            console.warn("Firebase Analytics is not supported or failed to initialize", e);
        }
    }
    return null;
};
exports.initAnalytics = initAnalytics;
const initMessaging = async () => {
    if (typeof window !== "undefined") {
        try {
            const { getMessaging, isSupported: isMessagingSupported } = await Promise.resolve().then(() => __importStar(require("firebase/messaging")));
            const supported = await isMessagingSupported();
            if (supported) {
                return getMessaging(app);
            }
        }
        catch (e) {
            console.warn("Firebase Messaging is not supported or failed to initialize", e);
        }
    }
    return null;
};
exports.initMessaging = initMessaging;
//# sourceMappingURL=firebase.js.map