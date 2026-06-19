/**
 * 🎭 Comprehensive Node.js Mock for Browser
 * --------------------------------------------------
 * Used by Vite aliases to shim Node.js built-ins.
 * Provides both named and default exports to satisfy different import styles.
 */

// --- util ---
export const promisify = (fn: any) => fn;
export const inherits = (ctor: any, superCtor: any) => {
    if (superCtor) {
        ctor.super_ = superCtor;
        Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
    }
};
export const types = {
    isAnyArrayBuffer: () => false,
    isUint8Array: (arr: any) => arr instanceof Uint8Array,
};
export const deprecate = (fn: any) => fn;
export const format = (...args: any[]) => args.join(' ');
export const inspect = (obj: any) => String(obj);

// --- events (ES6 class - required for libs like keccak256 that do `class Foo extends EventEmitter`) ---
export class EventEmitter {
    protected _listeners: Record<string, ((...args: any[]) => void)[]> = {};
    static defaultMaxListeners = 10;
    on(event: string, fn: (...args: any[]) => void) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(fn);
        return this;
    }
    off(event: string, fn: (...args: any[]) => void) {
        if (!this._listeners[event]) return this;
        this._listeners[event] = this._listeners[event].filter(f => f !== fn);
        return this;
    }
    once(event: string, fn: (...args: any[]) => void) {
        const onceFn = (...args: any[]) => { this.off(event, onceFn); fn.apply(this, args); };
        return this.on(event, onceFn);
    }
    emit(event: string, ...args: any[]) {
        if (!this._listeners[event]) return false;
        this._listeners[event].forEach(fn => fn.apply(this, args));
        return true;
    }
    addListener(event: string, fn: (...args: any[]) => void) { return this.on(event, fn); }
    removeListener(event: string, fn: (...args: any[]) => void) { return this.off(event, fn); }
    removeAllListeners(event?: string) { if (event) delete this._listeners[event]; else this._listeners = {}; return this; }
    setMaxListeners(_n: number) { return this; }
    getMaxListeners() { return EventEmitter.defaultMaxListeners; }
    listeners(event: string) { return this._listeners[event] || []; }
    rawListeners(event: string) { return this._listeners[event] || []; }
    listenerCount(event: string) { return (this._listeners[event] || []).length; }
}

// --- stream (ES6 class chain for keccak256/crypto compat) ---
export class Stream extends EventEmitter {
    pipe(dest: any) { return dest; }
}
export class PassThrough extends Stream {
    write(_chunk: any) { return true; }
    end() { }
    read() { return null; }
}
export class Readable extends PassThrough {
    push(_chunk: any) { return true; }
    resume() { return this; }
    pause() { return this; }
}
export class Writable extends Stream {
    write(_chunk: any) { return true; }
    end() { }
}
export class Duplex extends Readable {
    override write(_chunk: any) { return true; }
}
export class Transform extends Duplex {
    _transform(_chunk: any, _enc: any, cb: Function) { cb(); }
    _flush(cb: Function) { cb(); }
}
export const pipeline = (...args: any[]) => {
    if (typeof args[args.length - 1] === 'function') args[args.length - 1](null);
    return new PassThrough();
};

// --- crypto ---
export const createHash = () => ({
    update: () => ({ digest: () => '' }),
});
export const randomBytes = (size: number) => new Uint8Array(size);

// 使用瀏覽器原生 Web Crypto API (如果可用)
export const subtle = typeof globalThis.crypto !== 'undefined' ? globalThis.crypto.subtle : {
    digest: async () => new ArrayBuffer(32),
    encrypt: async () => new ArrayBuffer(0),
    decrypt: async () => new ArrayBuffer(0),
    sign: async () => new ArrayBuffer(0),
    verify: async () => false,
    generateKey: async () => ({}),
    importKey: async () => ({}),
    exportKey: async () => new ArrayBuffer(0),
};

export const randomUUID = () => typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


// --- path ---
export const resolve = (...args: string[]) => args.join('/');
export const join = (...args: string[]) => args.join('/');
export const dirname = (p: string) => p;
export const basename = (p: string) => p;
export const extname = (p: string) => '';
export const sep = '/';
export const posix = {
    resolve,
    join,
    dirname,
    basename,
    extname,
    sep: '/',
};
export const win32 = posix;

// --- fs ---
export const createReadStream = () => new (PassThrough as any)();
export const createWriteStream = () => new (PassThrough as any)();
export const readFileSync = () => '';
export const writeFile = () => { };
export const writeFileSync = () => { };
export const existsSync = () => false;
export const mkdirSync = () => { };
export const readdirSync = () => [];
export const statSync = () => ({ isDirectory: () => false, size: 0 });
export const promises = {
    readFile: async () => '',
    writeFile: async () => { },
    mkdir: async () => { },
    readdir: async () => [],
};

// --- url ---
export const fileURLToPath = (url: string) => url;
export const pathToFileURL = (path: string) => ({ href: path });
export const URL = globalThis.URL;

// --- process ---
export const env = {};
export const nextTick = (cb: Function) => setTimeout(cb, 0);
export const cwd = () => '/';
export const platform = 'browser';

// --- zlib ---
export const createGunzip = () => new (PassThrough as any)();
export const createGzip = () => new (PassThrough as any)();

// --- buffer ---
export class Buffer {
    static isBuffer(obj: any) { return false; }
    static from(data: any) { return new Uint8Array(data); }
    static concat(list: any[]) { return new Uint8Array(0); }
    static alloc(size: number) { return new Uint8Array(size); }
    static byteLength() { return 0; }
}

// --- net ---
export const isIP = () => 0;
export const isIPv4 = () => false;
export const isIPv6 = () => false;
export const Socket = function (this: any) {
    EventEmitter.call(this);
} as any;
inherits(Socket, EventEmitter);
Socket.prototype.connect = function () { return this; };
Socket.prototype.destroy = function () { };
export const createConnection = () => new Socket();

// --- google-auth-library ---
export class GoogleAuth {
    async getClient() { return {}; }
}

// --- querystring ---
export const stringify = (obj: any) => JSON.stringify(obj);
export const parse = (str: string) => ({});

// --- OpenTelemetry Mocks (for @google/adk) ---
export class NodeTracerProvider {
    register() { }
    addSpanProcessor() { }
}
export class ConsoleSpanExporter { }
export class SimpleSpanProcessor { }
export class BatchSpanProcessor { }
export class Resource {
    static default() { return new Resource(); }
    merge() { return this; }
}
export class CloudTraceExporter { }
export class CloudMonitoringExporter { }
export class MetricReader { }
export class PeriodicExportingMetricReader { }
export class MeterProvider {
    addMetricReader() { }
}
export class LoggerProvider {
    addLogRecordProcessor() { }
}
export class SimpleLogRecordProcessor { }
export class ConsoleLogRecordExporter { }
export class BatchLogRecordProcessor { }
export const detectResourcesSync = () => new Resource();
export const detectResources = async () => new Resource();
export const gcpDetector = {};
export const logs = {
    setGlobalLoggerProvider: () => { },
};
export class OTLPTraceExporter { }
export class OTLPMetricExporter { }
export class OTLPLogExporter { }
export class TraceExporter { } // Google Cloud Trace Exporter
export class MetricExporter { } // Google Cloud Monitoring Exporter

// --- ioredis mock ---
export class Redis {
    private _data: Map<string, string> = new Map();
    status = 'ready';
    on(_event: string, _fn: Function) { return this; }
    off(_event: string, _fn: Function) { return this; }
    once(_event: string, _fn: Function) { return this; }
    emit(_event: string, ..._args: any[]) { return false; }
    async get(key: string) { return this._data.get(key) ?? null; }
    async set(key: string, value: string) { this._data.set(key, value); return 'OK'; }
    async del(...keys: string[]) { keys.forEach(k => this._data.delete(k)); return keys.length; }
    async exists(key: string) { return this._data.has(key) ? 1 : 0; }
    async expire(_key: string, _seconds: number) { return 1; }
    async ttl(_key: string) { return -1; }
    async hset(_key: string, _field: string, _value: string) { return 1; }
    async hget(_key: string, _field: string) { return null; }
    async hgetall(_key: string) { return {}; }
    async lpush(_key: string, ..._values: string[]) { return 1; }
    async lrange(_key: string, _start: number, _stop: number) { return []; }
    async keys(_pattern: string) { return []; }
    async flushall() { this._data.clear(); return 'OK'; }
    async quit() { return 'OK'; }
    async ping() { return 'PONG'; }
    pipeline() { return this; }
    exec() { return Promise.resolve([]); }
    duplicate() { return new Redis(); }
    static Cluster = class { constructor(_nodes: any[], _opts?: any) { } };
}

// --- Default Export (Object containing all mocks) ---
const mock = {
    promisify,
    inherits,
    types,
    deprecate,
    format,
    inspect,
    EventEmitter,
    Stream,
    PassThrough,
    Readable,
    Writable,
    Transform,
    pipeline,
    createHash,
    randomBytes,
    subtle,
    randomUUID,
    resolve,
    join,
    dirname,
    basename,
    extname,
    sep,
    posix,
    win32,
    createReadStream,
    createWriteStream,
    readFileSync,
    writeFile,
    writeFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
    promises,
    fileURLToPath,
    pathToFileURL,
    URL,
    env,
    nextTick,
    cwd,
    platform,
    createGunzip,
    createGzip,
    Buffer,
    isIP,
    isIPv4,
    isIPv6,
    Socket,
    createConnection,
    GoogleAuth,
    stringify,
    parse,
    // OTEL
    NodeTracerProvider,
    ConsoleSpanExporter,
    SimpleSpanProcessor,
    BatchSpanProcessor,
    Resource,
    CloudTraceExporter,
    CloudMonitoringExporter,
    MetricReader,
    PeriodicExportingMetricReader,
    MeterProvider,
    LoggerProvider,
    SimpleLogRecordProcessor,
    ConsoleLogRecordExporter,
    BatchLogRecordProcessor,
    detectResourcesSync,
    detectResources,
    gcpDetector,
    logs,
    OTLPTraceExporter,
    OTLPMetricExporter,
    OTLPLogExporter,
    TraceExporter,
    MetricExporter,
    Redis,
    // dotenv compat: config() is the key method needed for `import dotenv from 'dotenv'; dotenv.config()`
    config: () => ({ parsed: {}, error: undefined }),
    populate: (_target: object, _parsed: object) => { },
};

// dotenv named config export (parse/stringify already exported above)
export const config = () => ({ parsed: {}, error: undefined });

export default mock;
