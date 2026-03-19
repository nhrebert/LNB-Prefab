import * as admin from 'firebase-admin';

// Check if Firebase Admin is already initialized. If not, initialize it.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle the newline characters correctly across different host VMs
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log("Firebase Admin successfully initialized!");
    } catch (error) {
        console.error("Firebase Admin initialization error", error);
    }
}

import { getFirestore } from 'firebase-admin/firestore';
export const db = getFirestore('default');
