// CLIENT shim — zero fs import. Drop into src/lib/firebase.ts.
import type { DocData } from './types';

const isServer = typeof window === 'undefined';
const memory = new Map<string, Record<string, DocData>>();

function readCol(name: string): Record<string, DocData> {
  if (isServer) return (globalThis as any).__esggoLocalStore?.get(name) ?? {};
  try {
    const raw = window.localStorage.getItem(`esggo_db_${name}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return memory.get(name) ?? {}; }
}
function writeCol(name: string, data: Record<string, DocData>): void {
  if (isServer) {
    if (!(globalThis as any).__esggoLocalStore) (globalThis as any).__esggoLocalStore = new Map();
    (globalThis as any).__esggoLocalStore.set(name, data);
    return;
  }
  try { window.localStorage.setItem(`esggo_db_${name}`, JSON.stringify(data)); } catch {}
  memory.set(name, data);
}
function notify(name: string): void {
  if (typeof BroadcastChannel !== 'undefined') {
    const ch = new BroadcastChannel('esggo_db'); ch.postMessage({ collection: name }); ch.close();
  }
}
class Snapshot { constructor(public docs: any[]) {} forEach(cb: any){ this.docs.forEach(cb); } }
class QB {
  constructor(private c: string, private w: any[] = [], private o: any = null, private l: any = null) {}
  where(f: string, op: string, v: any) { return new QB(this.c, [...this.w, { f, op, v }], this.o, this.l); }
  orderBy(f: string, d: 'asc'|'desc' = 'desc') { return new QB(this.c, this.w, { f, d }, this.l); }
  limit(n: number) { return new QB(this.c, this.w, this.o, n); }
  async get() {
    let rows = Object.entries(readCol(this.c)).filter(([,d]) => this.w.every(({f,op,v}) => {
      const x = (d as any)[f];
      if (op==='==') return x===v; if (op==='!=') return x!==v;
      if (op==='>') return (x as number)>(v as number); if (op==='>=') return (x as number)>=(v as number);
      if (op==='<') return (x as number)<(v as number); if (op==='<=') return (x as number)<=(v as number);
      return false;
    })).map(([id, d]) => ({ id, data: () => d }));
    if (this.o) rows.sort((a,b)=>{ const av=(a.data() as any)[this.o.f], bv=(b.data() as any)[this.o.f];
      if (av===bv) return 0; const c = av<bv?-1:1; return this.o.d==='asc'?c:-c; });
    if (this.l!==null) rows = rows.slice(0, this.l);
    return new Snapshot(rows);
  }
}
class DocRef { constructor(public c: string, public id: string) {}
  async get(){ const d = readCol(this.c)[this.id]; return { exists: !!d, id: this.id, data: () => d ?? null }; }
  async set(data: DocData){ const all = readCol(this.c); all[this.id] = data; writeCol(this.c, all); notify(this.c); }
  async delete(){ const all = readCol(this.c); delete all[this.id]; writeCol(this.c, all); notify(this.c); }
}
class ColRef { constructor(public name: string) {}
  doc(id: string){ return new DocRef(this.name, id); }
  async add(d: DocData){ const id = `${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
    const all = readCol(this.name); all[id] = d; writeCol(this.name, all); notify(this.name); return { id }; }
  where(f:string,op:string,v:any){ return new QB(this.name).where(f,op,v); }
  orderBy(f:string,d:'asc'|'desc'='desc'){ return new QB(this.name).orderBy(f,d); }
  limit(n:number){ return new QB(this.name).limit(n); }
  async get(){ return new QB(this.name).get(); }
}
export const db = { __local: true as const };
export const collection = (_d: any, n: string) => new ColRef(n);
export const doc = (_d: any, c: string, id: string) => new DocRef(c, id);
export const query = (ref: QB, ...c: any[]) => c.reduce((a,f)=>f(a), ref);
export const where = (f:string,op:string,v:any) => (r:QB)=>r.where(f,op,v);
export const orderBy = (f:string,d:'asc'|'desc'='desc') => (r:QB)=>r.orderBy(f,d);
export const limit = (n:number) => (r:QB)=>r.limit(n);
export const getDocs = (q: QB) => q.get();
export const getDoc = (r: DocRef) => r.get();
export const addDoc = (r: ColRef, d: DocData) => r.add(d);
export const setDoc = (r: DocRef, d: DocData) => r.set(d);
export const deleteDoc = (r: DocRef) => r.delete();
export function onSnapshot(ref: QB, cb: (s: Snapshot)=>void): () => void {
  let stopped = false; const run = () => { if (!stopped) ref.get().then(cb); };
  run(); const iv = setInterval(run, 2000) as any;
  return () => { stopped = true; clearInterval(iv); };
}
export function writeBatch(_d: any) {
  const ops: Array<()=>void> = [];
  return { set: (r: DocRef, d: DocData)=>ops.push(()=>r.set(d)),
           delete: (r: DocRef)=>ops.push(()=>r.delete()),
           commit: async ()=>ops.forEach(o=>o()) };
}
