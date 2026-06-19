import {
    db
} from '@/lib/firebase';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Timestamp, FieldValue } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
    createdAt: Timestamp | FieldValue;
    lastLogin: Timestamp | FieldValue;
    role: 'user' | 'admin';
    metadata?: Record<string, unknown>;
}

export async function syncUserProfile(user: User): Promise<UserProfile> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        lastLogin: serverTimestamp(),
    };

    if (!userSnap.exists()) {
        // Create new profile
        const newProfile: UserProfile = {
            ...profileData,
            createdAt: serverTimestamp(),
            role: 'user',
        };
        await setDoc(userRef, newProfile);
        return newProfile as UserProfile;
    } else {
        // Update existing profile
        await updateDoc(userRef, profileData);
        return userSnap.data() as UserProfile;
    }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }

    return null;
}
