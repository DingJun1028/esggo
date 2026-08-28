// SERVER store — uses fs. Import ONLY from API routes, never from client components.
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
async function ensureDir(){ await fs.mkdir(DATA_DIR, { recursive: true }); }
function file(c: string){ return path.join(DATA_DIR, `${c.replace(/[^a-zA-Z0-9_-]/g,'_')}.json`); }
async function read(c: string): Promise<Record<string, any>> {
  try { return JSON.parse(await fs.readFile(file(c), 'utf-8')); }
  catch (e: any) { if (e.code === 'ENOENT') return {}; return {}; }
}
async function write(c: string, data: Record<string, any>): Promise<void> {
  await ensureDir();
  const tmp = `${file(c)}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file(c)); // atomic
}
function genId(){ return `${Date.now()}_${Math.random().toString(36).slice(2,10)}`; }
class DocRef { constructor(private c: string, private id: string) {}
  async get(){ const d = (await read(this.c))[this.id]; return { exists: !!d, id: this.id, data: () => d ?? null }; }
  async set(d: any, opts?: {merge?:boolean}){ const all = await read(this.c); const ex = all[this.id] ?? {};
    all[this.id] = opts?.merge ? { ...ex, ...d } : d; await write(this.c, all); }
  async delete(){ const all = await read(this.c); delete all[this.id]; await write(this.c, all); }
}
class ColRef { constructor(private name: string) {}
  doc(id: string){ return new DocRef(this.name, id); }
  async add(d: any){ const id = genId(); const all = await read(this.name); all[id] = d; await write(this.name, all); return { id }; }
  where(f:string,op:string,v:any){ return new QB(this.name).where(f,op,v); }
  orderBy(f:string,d:'asc'|'desc'='desc'){ return new QB(this.name).orderBy(f,d); }
  limit(n:number){ return new QB(this.name).limit(n); }
  async get(){ return new QB(this.name).get(); }
}
// QB (QueryBuilder) mirrors the client shim's QB but reads from fs-backed store.
class QB {
  constructor(private c: string, private w: any[] = [], private o: any = null, private l: any = null) {}
  where(f:string,op:string,v:any){ return new QB(this.c,[...this.w,{f,op,v}],this.o,this.l); }
  orderBy(f:string,d:'asc'|'desc'='desc'){ return new QB(this.c,this.w,{f,d},this.l); }
  limit(n:number){ return new QB(this.c,this.w,this.o,n); }
  async get(){
    let rows = Object.entries(await read(this.c)).filter(([,d]) => this.w.every(({f,op,v}) => {
      const x = (d as any)[f];
      if (op==='==') return x===v; if (op==='!=') return x!==v;
      if (op==='>') return (x as number)>(v as number); if (op==='>=') return (x as number)>=(v as number);
      if (op==='<') return (x as number)<(v as number); if (op==='<=') return (x as number)<=(v as number);
      return false;
    })).map(([id,d]) => ({ id, data: () => d }));
    if (this.o) rows.sort((a,b)=>{ const av=(a.data() as any)[this.o.f], bv=(b.data() as any)[this.o.f];
      if (av===bv) return 0; const c = av<bv?-1:1; return this.o.d==='asc'?c:-c; });
    if (this.l!==null) rows = rows.slice(0, this.l);
    return { docs: rows };
  }
}
export const adminDb = {
  collection: (n: string) => new ColRef(n),
  doc: (p: string) => { const [c,id,...rest] = p.split('/').filter(Boolean);
    if (rest.length) return new DocRef(c, id).collection(rest[0]).doc(rest[1]); return new DocRef(c, id); },
  runTransaction: async (fn: (t: any) => Promise<any>) => fn({
    get: (r: DocRef) => r.get(), set: (r: DocRef, d: any) => r.set(d),
    update: (r: DocRef, d: any) => r.set(d, { merge: true }), delete: (r: DocRef) => r.delete() }),
};
