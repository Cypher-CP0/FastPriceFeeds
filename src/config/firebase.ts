import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { env } from './env';

const app = initializeApp(env.firebase);
export const db = getFirestore(app);