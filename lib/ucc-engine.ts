export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  readonly hash_lock: string;
  evidence: Record<string, unknown>;
}

export interface ILifecycleEvent {
  readonly event_id: string;
  readonly component_uuid: string;
  readonly from_state: string;
  readonly to_state: string;
  readonly timestamp: number;
  readonly actor: string;
  readonly hash_lock: string;
}

export interface ITask extends IComponentCore {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  department: string;
  gri_reference: string;
  due_date: string;
  tags: string[];
  lifecycle: ILifecycleEvent[];
}

export class EntropyForge {
  generateHash(input: string): string {
    let hash = 0;
    const str = input + Date.now().toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
  }

  generateDeterministicHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
  }

  sealTask(task: Omit<ITask, 'hash_lock'>): ITask {
    const hashInput = JSON.stringify({
      uuid: task.uuid,
      title: task.title,
      timestamp: task.timestamp,
    });
    return Object.freeze({
      ...task,
      hash_lock: this.generateDeterministicHash(hashInput),
    }) as ITask;
  }

  createLifecycleEvent(
    component_uuid: string,
    from_state: string,
    to_state: string,
    actor: string
  ): ILifecycleEvent {
    const event_id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = Date.now();
    const hashInput = `${event_id}:${component_uuid}:${from_state}:${to_state}:${timestamp}`;
    return Object.freeze({
      event_id,
      component_uuid,
      from_state,
      to_state,
      timestamp,
      actor,
      hash_lock: this.generateDeterministicHash(hashInput),
    });
  }

  verify5TCompliance(task: ITask): { score: number; flags: string[] } {
    const flags: string[] = [];
    let score = 100;
    if (!task.evidence || Object.keys(task.evidence).length === 0) {
      flags.push('T1: Missing evidence traceability');
      score -= 20;
    }
    if (!task.gri_reference) {
      flags.push('T2: No GRI standard reference');
      score -= 20;
    }
    if (!task.hash_lock || task.hash_lock.length !== 64) {
      flags.push('T4: Integrity hash invalid');
      score -= 30;
    }
    if (!task.lifecycle || task.lifecycle.length === 0) {
      flags.push('T5: No lifecycle tracking');
      score -= 15;
    }
    return { score: Math.max(0, score), flags };
  }
}

export class UCCRegistry {
  private tasks: Map<string, ITask> = new Map();
  private forge = new EntropyForge();

  register(taskData: Omit<ITask, 'uuid' | 'version' | 'timestamp' | 'hash_lock' | 'lifecycle'>): ITask {
    const uuid = `task_${crypto.randomUUID()}`;
    const partial = {
      ...taskData,
      uuid,
      version: '1.0.0',
      timestamp: Date.now(),
      lifecycle: [] as ILifecycleEvent[],
    };
    const task = this.forge.sealTask(partial);
    this.tasks.set(uuid, task);
    return task;
  }

  transition(uuid: string, to_state: ITask['status'], actor: string): ITask | null {
    const task = this.tasks.get(uuid);
    if (!task) return null;
    const event = this.forge.createLifecycleEvent(uuid, task.status, to_state, actor);
    const updated: ITask = {
      ...task,
      status: to_state,
      lifecycle: [...task.lifecycle, event],
      hash_lock: this.forge.generateDeterministicHash(`${uuid}:${to_state}:${Date.now()}`),
    };
    this.tasks.set(uuid, updated);
    return updated;
  }

  getAll(): ITask[] {
    return Array.from(this.tasks.values());
  }

  getByStatus(status: ITask['status']): ITask[] {
    return this.getAll().filter(t => t.status === status);
  }
}
