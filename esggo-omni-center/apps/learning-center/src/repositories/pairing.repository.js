import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  FirestoreError,
} from 'firebase/firestore';

import { useFirebase, APP_ID, db, emitTelemetry } from '../db';

const PAIRING_STATUS = Object.freeze({ PENDING: 'pending', ASSIGNED: 'assigned', DECLINED: 'declined' });

const pairingDocId = (mentorUid, menteeUid) => `${mentorUid}__${menteeUid}`;
const collectionLocalStoragePrefix = () => `berkeley_pairing_${APP_ID}_`;
const storeKeyFor = (id) => `${collectionLocalStoragePrefix()}${id}`;

const newPairingPayload = (mentorUid, menteeUid, status = PAIRING_STATUS.PENDING) => ({
  mentorUid,
  menteeUid,
  status,
  note: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createPairingRequest = async (mentorUid, menteeUid) => {
  const docId = pairingDocId(mentorUid, menteeUid);
  const next = newPairingPayload(mentorUid, menteeUid);
  await setPairing(docId, next);
  emitTelemetry('pairing_request', { mentorUid, menteeUid });
  return docId;
};

export const acceptPairing = async (mentorUid, menteeUid) => {
  const docId = pairingDocId(mentorUid, menteeUid);
  await updatePairing(docId, { status: PAIRING_STATUS.ASSIGNED, updatedAt: new Date().toISOString() });
  return docId;
};

export const declinePairing = async (mentorUid, menteeUid) => {
  const docId = pairingDocId(mentorUid, menteeUid);
  await updatePairing(docId, { status: PAIRING_STATUS.DECLINED, updatedAt: new Date().toISOString() });
  return docId;
};

export const removePairing = async (mentorUid, menteeUid) => {
  const docId = pairingDocId(mentorUid, menteeUid);
  if (useFirebase && db) {
    await deleteDoc(doc(db, 'platforms', APP_ID, 'pairings', docId));
  } else {
    localStorage.removeItem(storeKeyFor(docId));
    emitPairingLocalEvent();
  }
  return docId;
};

export const loadPairing = async (mentorUid, menteeUid) => {
  const docId = pairingDocId(mentorUid, menteeUid);
  if (useFirebase && db) {
    const snap = await getDoc(doc(db, 'platforms', APP_ID, 'pairings', docId));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  }

  try { const raw = localStorage.getItem(storeKeyFor(docId)); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
};

export const listPairingsForMentor = async (mentorUid) => {
  if (useFirebase && db) {
    const ref = collection(db, 'platforms', APP_ID, 'pairings');
    const q = query(ref, where('mentorUid', '==', mentorUid));
    const snap = await getDocs(q);
    return snap.docs.map((document) => ({ id: document.id, ...document.data() }));
  }

  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(collectionLocalStoragePrefix())) continue;
    try {
      const record = JSON.parse(localStorage.getItem(key) || '{}');
      if (record?.mentorUid === mentorUid) out.push({ id: key.replace(collectionLocalStoragePrefix(), ''), ...record });
    } catch { /* ignore */ }
  }
  return out;
};

export const listPairingsForMentee = async (menteeUid) => {
  if (useFirebase && db) {
    const ref = collection(db, 'platforms', APP_ID, 'pairings');
    const q = query(ref, where('menteeUid', '==', menteeUid));
    const snap = await getDocs(q);
    return snap.docs.map((document) => ({ id: document.id, ...document.data() }));
  }

  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(collectionLocalStoragePrefix())) continue;
    try {
      const record = JSON.parse(localStorage.getItem(key) || '{}');
      if (record?.menteeUid === menteeUid) out.push({ id: key.replace(collectionLocalStoragePrefix(), ''), ...record });
    } catch { /* ignore */ }
  }
  return out;
};

export const subscribePairings = (onData) => {
  if (useFirebase && db) {
    const collectionRef = collection(db, 'platforms', APP_ID, 'pairings');
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => onData(snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))),
      (error) => {
        console.error('Pairing snapshot error', error);
        if (error instanceof FirestoreError) emitTelemetry('pairing_subscription_error', { code: error.code });
      }
    );
    return unsubscribe;
  }

  const listeners = window.__pairingLocalListeners || (window.__pairingLocalListeners = new Set());
  const next = () => {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(collectionLocalStoragePrefix())) continue;
      try { out.push({ id: key.replace(collectionLocalStoragePrefix(), ''), ...JSON.parse(localStorage.getItem(key) || '{}') }); }
      catch { /* ignore */ }
    }
    onData(out);
  };
  const cleanup = () => { listeners.delete(next); };
  listeners.add(next);
  next();
  return cleanup;
};

const setPairing = async (id, payload) => {
  if (useFirebase && db) {
    await setDoc(doc(db, 'platforms', APP_ID, 'pairings', id), payload);
    return;
  }
  localStorage.setItem(storeKeyFor(id), JSON.stringify(payload));
  emitPairingLocalEvent();
};

const updatePairing = async (id, patch) => {
  if (useFirebase && db) {
    await setDoc(doc(db, 'platforms', APP_ID, 'pairings', id), patch, { merge: true });
    return;
  }
  const current = JSON.parse(localStorage.getItem(storeKeyFor(id)) || '{}');
  const next = { ...current, ...patch };
  localStorage.setItem(storeKeyFor(id), JSON.stringify(next));
  emitPairingLocalEvent();
};

const pairingLocalListeners = window.__pairingLocalListeners || (window.__pairingLocalListeners = new Set());

const emitPairingLocalEvent = () => {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(collectionLocalStoragePrefix())) continue;
    try { out.push({ id: key.replace(collectionLocalStoragePrefix(), ''), ...JSON.parse(localStorage.getItem(key) || '{}') }); }
    catch { /* ignore */ }
  }
  for (const cb of [...pairingLocalListeners]) {
    try { cb(out); } catch { pairingLocalListeners.delete(cb); }
  }
};

export { PAIRING_STATUS };
