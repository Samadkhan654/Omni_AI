import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Sign in anonymously to guarantee secure session identification on preview load
export let isAnonymousAuthEnabled = true;

signInAnonymously(auth)
  .then(() => {
    isAnonymousAuthEnabled = true;
  })
  .catch((err: any) => {
    isAnonymousAuthEnabled = false;
    if (err && (err.code === 'auth/admin-restricted-operation' || String(err).includes('admin-restricted-operation'))) {
      console.log(
        "%cℹ️ Firebase Auth Info: Anonymous Sign-In is currently disabled in your Firebase project configuration. " +
        "To enable cloud storage synchronization, go to Firebase Console > Authentication > Sign-in method, " +
        "enable 'Anonymous', and save. The app is running smoothly in local persistence/fallback mode in the meantime! ✨",
        "color: #D97706; font-weight: 600; font-family: system-ui, sans-serif;"
      );
    } else {
      console.info("Firebase Auth operates in secure local storage fallback mode: ", err?.message || err);
    }
  });

// Test Connection on Boot as requested by the Firebase integration skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Define Error Handler as requested by the Firebase integration skill: "3. Create error handlers"
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || 'guest',
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Durable cloud persistence wrappers for collections
export async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: T[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    return [];
  }
}

export async function writeDocumentData(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

export async function deleteDocumentData(collectionName: string, docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}
