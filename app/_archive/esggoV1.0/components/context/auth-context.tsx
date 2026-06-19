"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
    onAuthStateChanged,
    User,
    signOut,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signInAnonymously
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useRecaptcha } from "@/lib/hooks/use-recaptcha";
import { useGetCurrentUser, useUpsertUser } from "@dataconnect/generated/react";
import { GetCurrentUserData } from "@dataconnect/generated";

interface AuthContextType {
    user: User | null;
    fdcUser: GetCurrentUserData['user'] | null;
    subscription: string | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    loginAsDeveloper: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { executeRecaptcha } = useRecaptcha();

    // ==========================================
    // 全端雙向 TypeScript：使用生成之 Hooks
    // ==========================================
    const { data: fdcData, refetch: refetchUser } = useGetCurrentUser();
    const { mutateAsync: upsertUserFdc } = useUpsertUser();

    const loginAsDeveloper = useCallback(async () => {
        try {
            // Use real Anonymous Auth for valid session token
            const cred = await signInAnonymously(auth);

            // Upsert a developer profile in Firestore for this anonymous user
            const userRef = doc(db, "users", cred.user.uid);
            await setDoc(userRef, {
                uid: cred.user.uid,
                email: "dev-guest@esg-go.com",
                displayName: "Developer Admin",
                role: "developer",
                subscription: "enterprise",
                isDeveloperBypass: true,
                createdAt: serverTimestamp(),
            }, { merge: true });

            setSubscription("enterprise");
        } catch (error) {
            console.error("Developer bypass failed:", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        if (!auth) return;

        // Developer Fast-Track (Bypass)
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("channel") === "dev") {
                console.log("🚀 Developer Fast-Track detected, initiating bypass...");
                loginAsDeveloper().catch(err => console.error("Fast track failed:", err));
            }
        }

        // Handle Redirect Result (for Google Login callback)
        getRedirectResult(auth).then(async (result) => {
            if (result?.user) {
                console.log("🔄 Redirect login detected, upserting profile for:", result.user.email);
                await upsertUserProfile(result.user);
            }
        }).catch((err) => {
            console.error("Redirect result error:", err);
        });

        let unsubProfile: (() => void) | null = null;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (unsubProfile) {
                unsubProfile();
                unsubProfile = null;
            }

            if (user) {
                // Sync to Data Connect for "Bidirectional TypeScript" integrity
                try {
                    await upsertUserFdc({
                        displayName: user.displayName || user.email?.split("@")[0] || "User",
                        email: user.email || ""
                    });
                    refetchUser();
                } catch (err) {
                    console.error("FDC Sync Error (Silently handled):", err);
                }

                // Listen to profile/subscription real-time (Legacy Firestore fallback)
                unsubProfile = onSnapshot(doc(db, "users", user.uid), (snap) => {
                    if (snap.exists()) {
                        setSubscription(snap.data().subscription || "free");
                    } else {
                        setSubscription("free");
                    }
                }, (err) => {
                    console.error("Profile sync error (Likely permission check):", err);
                    setSubscription("free");
                });
            } else {
                setSubscription(null);
                // AUTO-ANONYMOUS LOGIN: Ensure valid session for development/unauthenticated guests
                if (!loading) {
                    console.log("👤 No user detected, initiating anonymous login for seamless ESG experience...");
                    signInAnonymously(auth).catch(err => console.error("Anonymous login failed:", err));
                }
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (unsubProfile) unsubProfile();
        };
    }, [loginAsDeveloper, refetchUser, upsertUserFdc]);

    const upsertUserProfile = async (user: User) => {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split("@")[0] || "User",
                photoURL: user.photoURL || null,
                role: "user",
                subscription: "free",
                createdAt: serverTimestamp(),
            });
        }
    };

    const loginWithGoogle = async () => {
        try {
            await executeRecaptcha("LOGIN");
            const provider = new GoogleAuthProvider();

            // 優先嘗試彈出視窗，若被攔截則可在 View 層決定是否切換至 Redirect
            // 但在這裡我們提供一個穩定的封裝
            try {
                const cred = await signInWithPopup(auth, provider);
                await upsertUserProfile(cred.user);
            } catch (popupError: any) {
                // 如果是移動端或特定的攔截行為，這裡可以考慮自動切換或報錯讓 View 處理
                if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/cancelled-popup-request') {
                    console.log("Popup blocked/cancelled, falling back to redirect...");
                    await signInWithRedirect(auth, provider);
                } else {
                    throw popupError;
                }
            }
        } catch (error) {
            console.error("Login with Google failed:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await executeRecaptcha("LOGIN");
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            await upsertUserProfile(cred.user);
        } catch (error) {
            console.error("Login with Email failed:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
        try {
            await executeRecaptcha("SIGNUP");
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            if (displayName) {
                await updateProfile(cred.user, { displayName });
            }
            await upsertUserProfile(cred.user);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await executeRecaptcha("PASSWORD_RESET");
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error("Password reset failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            fdcUser: fdcData?.user || null,
            subscription,
            loading,
            loginWithGoogle,
            loginWithEmail,
            registerWithEmail,
            resetPassword,
            logout,
            loginAsDeveloper
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
