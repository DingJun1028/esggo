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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setClaims = void 0;
const functions = __importStar(require("firebase-functions/v2/https"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const ADMIN_PASS = (process.env.ADMIN_PASS || '').trim();
const TA_PASS = (process.env.TA_PASS || '').trim();
const ALLOWED_ROLES = new Set(['student', 'TA', 'admin']);
function normalizeRole(value) {
    const raw = String(value ?? '').trim();
    return ALLOWED_ROLES.has(raw) ? raw : 'student';
}
function isAuthorized(req) {
    if (!ADMIN_PASS && !TA_PASS) {
        return { authorized: true, role: 'admin' };
    }
    const adminPass = req.body?.adminPass;
    if (ADMIN_PASS && adminPass === ADMIN_PASS) {
        return { authorized: true, role: 'admin' };
    }
    const taPass = req.body?.taPass;
    if (TA_PASS && taPass === TA_PASS) {
        return { authorized: true, role: 'TA' };
    }
    return { authorized: false, role: null };
}
exports.setClaims = functions.onRequest(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ error: 'method_not_allowed' });
            return;
        }
        const authHeader = req.headers.authorization || '';
        const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
        if (!idToken) {
            res.status(401).send({ error: 'missing_token' });
            return;
        }
        let decoded;
        try {
            decoded = await admin.auth().verifyIdToken(idToken);
            if (decoded?.aud !== process.env.FIREBASE_PROJECT_ID) {
                throw new Error('unexpected_aud');
            }
        }
        catch {
            res.status(401).send({ error: 'invalid_token' });
            return;
        }
        const callerUid = decoded.uid;
        const payload = req.body || {};
        const targetUid = typeof payload.uid === 'string' && payload.uid.trim() ? payload.uid.trim() : callerUid;
        const nextRole = normalizeRole(payload.role);
        const { authorized, role: callerRole } = isAuthorized(req);
        if (!authorized) {
            res.status(403).send({ error: 'forbidden' });
            return;
        }
        if (callerUid !== targetUid && callerRole !== 'admin') {
            res.status(403).send({ error: 'forbidden' });
            return;
        }
        if (nextRole === 'admin' && callerRole !== 'admin') {
            res.status(403).send({ error: 'forbidden' });
            return;
        }
        const patch = { role: nextRole };
        if (typeof payload.displayName === 'string' && payload.displayName.trim()) {
            patch.displayName = payload.displayName.trim();
        }
        await admin.auth().setCustomUserClaims(targetUid, patch);
        if (patch.displayName && targetUid === callerUid) {
            try {
                await admin.auth().updateUser(targetUid, { displayName: patch.displayName });
            }
            catch {
                // best-effort；不以 profile update 阻擋 claims 設定
            }
        }
        res.status(200).send({ uid: targetUid, role: nextRole });
    }
    catch (error) {
        console.error('[setClaims]', error);
        res.status(500).send({ error: 'set_claims_failed' });
    }
});
