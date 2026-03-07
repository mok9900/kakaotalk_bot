import { initializeApp, type FirebaseApp } from 'firebase/app';
import type { ServiceHealth } from '@shared/types/system';

const firebaseConfig = {
  apiKey: 'AIzaSyBsD8zd0KP5enQZr3-KEJj0wA_HhZqt6UA',
  authDomain: 'kakaotalkbotkr.firebaseapp.com',
  projectId: 'kakaotalkbotkr',
  storageBucket: 'kakaotalkbotkr.firebasestorage.app',
  messagingSenderId: '808367161223',
  appId: '1:808367161223:web:1d8540ca08ecd112a85d22',
  measurementId: 'G-955S6WGKXX'
};

export class FirebaseService {
  private connected = false;
  private app: FirebaseApp | null = null;
  private lastError?: string;

  async initialize(): Promise<void> {
    try {
      this.app = initializeApp(firebaseConfig);
      this.connected = true;
      this.lastError = undefined;
    } catch (error) {
      this.connected = false;
      this.lastError = error instanceof Error ? error.message : String(error);
    }
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      name: 'firebase',
      status: this.connected ? 'healthy' : 'degraded',
      lastCheckedAt: new Date().toISOString(),
      details: this.connected ? `Firebase 연결됨 (${this.app?.name ?? 'default'})` : `Firebase 연결 실패: ${this.lastError ?? 'unknown error'}`
    };
  }
}
