import {
    storage,
    db
} from '@/lib/firebase';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import {
    collection,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

export interface FileUploadResult {
    url: string;
    path: string;
    name: string;
    size: number;
    type: string;
}

export async function uploadFile(
    file: File,
    path: string,
    userId: string,
    metadata?: Record<string, string>
): Promise<FileUploadResult> {
    const fileRef = ref(storage, `${path}/${Date.now()}-${file.name}`);

    const uploadTask = uploadBytesResumable(fileRef, file, {
        customMetadata: {
            userId,
            ...metadata
        }
    });

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);

                // Log to Audit Trail in Firestore
                await addDoc(collection(db, 'audit_trail'), {
                    action: 'UPLOAD',
                    resource: 'STORAGE',
                    fileName: file.name,
                    filePath: fileRef.fullPath,
                    userId,
                    timestamp: serverTimestamp(),
                    metadata
                });

                resolve({
                    url,
                    path: fileRef.fullPath,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            }
        );
    });
}

export async function deleteFile(path: string, userId: string) {
    const fileRef = ref(storage, path);

    await deleteObject(fileRef);

    // Log deletion
    await addDoc(collection(db, 'audit_trail'), {
        action: 'DELETE',
        resource: 'STORAGE',
        filePath: path,
        userId,
        timestamp: serverTimestamp()
    });
}
