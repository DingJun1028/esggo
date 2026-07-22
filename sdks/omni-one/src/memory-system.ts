import { IMemoryRecord } from "./types";
export class MemorySystem {
  private memories: IMemoryRecord[] = [];
  public async retrieveRelevant(query: string) { return this.memories.slice(0, 5); }
  public async storeExperience(record: Omit<IMemoryRecord, "id" | "timestamp">) {
    const r = { ...record, id: "MEM" + Date.now(), timestamp: Date.now() };
    this.memories.push(r);
    return r.id;
  }
}