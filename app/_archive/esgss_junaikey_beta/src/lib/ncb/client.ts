import { Database } from '@/types/database.js';

const isBrowser = typeof window !== 'undefined';

if (!isBrowser) {
  try {
    const { default: dotenv } = await import('dotenv');
    dotenv.config();
  } catch (err) {
    // Ignored
  }
}

const PROXY_ROOT = '/api/ncb';

let ncbSession: { token?: string; userId?: string } | null = null;
let initPromise: Promise<any> | null = null;

if (!isBrowser) {
  console.log('[NCB Client] Initialized in Node.js');
  console.log(
    '[NCB Client] NCB_DATA_API_URL:',
    process.env.NCB_DATA_API_URL ? 'PRESENT' : 'MISSING'
  );
}

export class NcbQueryBuilder<T> {
  private table: string;
  private query: URLSearchParams;
  private method: string;
  private body: any;
  private isSingle: boolean = false;
  private baseUrl: string;

  constructor(table: string, baseUrl: string) {
    this.table = table;
    this.baseUrl = baseUrl;
    this.query = new URLSearchParams();
    this.method = 'GET';
  }

  select(columns = '*'): this {
    this.method = 'GET';
    return this;
  }

  insert(data: Partial<T> | Partial<T>[]): this {
    this.method = 'POST';
    this.body = data;
    return this;
  }

  update(data: Partial<T>): this {
    this.method = 'PUT';
    this.body = data;
    return this;
  }

  delete(): this {
    this.method = 'DELETE';
    return this;
  }

  eq(column: string, value: any): this {
    this.query.append(column, String(value));
    return this;
  }

  neq(column: string, value: any): this {
    this.query.append(`${column}[ne]`, String(value));
    return this;
  }

  gt(column: string, value: any): this {
    this.query.append(`${column}[gt]`, String(value));
    return this;
  }

  gte(column: string, value: any): this {
    this.query.append(`${column}[gte]`, String(value));
    return this;
  }

  lt(column: string, value: any): this {
    this.query.append(`${column}[lt]`, String(value));
    return this;
  }

  lte(column: string, value: any): this {
    this.query.append(`${column}[lte]`, String(value));
    return this;
  }

  like(column: string, value: any): this {
    this.query.append(`${column}[like]`, String(value));
    return this;
  }

  in(column: string, value: any[]): this {
    this.query.append(`${column}[in]`, value.join(','));
    return this;
  }

  order(column: string, { ascending = true } = {}): this {
    this.query.append('sort', column);
    this.query.append('order', ascending ? 'asc' : 'desc');
    return this;
  }

  limit(count: number): this {
    this.query.append('limit', String(count));
    return this;
  }

  single(): Promise<{ data: T | null; error: any }> {
    this.isSingle = true;
    this.query.append('limit', '1');
    return this.exec() as any;
  }

  maybeSingle(): Promise<{ data: T | null; error: any }> {
    this.isSingle = true;
    this.query.append('limit', '1');
    return this.exec() as any;
  }

  private getHeaders() {
    const headers: any = {
      'Content-Type': 'application/json',
      Origin: 'https://esgss-junaikey-beta.vercel.app',
    };

    if (!isBrowser) {
      const token = process.env.NCB_API_TOKEN;
      if (token) {
        headers['secret_key'] = token;
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (ncbSession && ncbSession.token) {
        headers['Authorization'] = `Bearer ${ncbSession.token}`;
        headers['Cookie'] = `session=${ncbSession.token}`;
      }
      if (process.env.NCB_INSTANCE) {
        headers['X-Database-Instance'] = process.env.NCB_INSTANCE;
      }
    }

    return headers;
  }

  private getUrl(path: string) {
    const cleanBase = this.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${cleanBase}${cleanPath}`;

    const searchParams = new URLSearchParams(this.query);

    if (!isBrowser) {
      const instance = process.env.NCB_INSTANCE;
      if (instance && !searchParams.has('Instance')) {
        searchParams.set('Instance', instance);
      }

      const token = process.env.NCB_API_TOKEN;
      if (token && !searchParams.has('secret_key')) {
        searchParams.set('secret_key', token);
      }
    }

    const params = searchParams.toString();
    return params ? `${fullUrl}?${params}` : fullUrl;
  }

  async exec(): Promise<{ data: T[] | T | null; error: any }> {
    try {
      let path = '';
      if (this.method === 'GET') {
        path = `/read/${this.table}`;
      } else if (this.method === 'POST') {
        path = `/create/${this.table}`;
      } else if (this.method === 'PUT') {
        const idParam = this.query.get('id');
        if (idParam) {
          path = `/update/${this.table}/${idParam}`;
        } else {
          return { data: null, error: { message: 'Update requires ID filter' } };
        }
      } else if (this.method === 'DELETE') {
        const idParam = this.query.get('id');
        if (idParam) {
          path = `/delete/${this.table}/${idParam}`;
        } else {
          return { data: null, error: { message: 'Delete requires ID filter' } };
        }
      }

      const url = this.getUrl(path);
      const headers = this.getHeaders();

      const res = await fetch(url, {
        method: this.method,
        headers,
        body: this.body ? JSON.stringify(this.body) : undefined,
      }).catch(err => {
        console.error(`[NCB Client Error] Fetch failed for URL: ${url}`);
        console.error(`[NCB Client Error] Details:`, err);
        throw err;
      });

      let json;
      try {
        const text = await res.text();
        json = text ? JSON.parse(text) : {};
      } catch {
        return {
          data: null,
          error: { message: 'Failed to parse JSON response', status: res.status },
        };
      }

      if (!res.ok) {
        console.error(`[NCB API Error] ${this.method} ${url} - Status: ${res.status}`);
        console.error(`[NCB API Error] Response:`, JSON.stringify(json, null, 2));
        if (this.body) {
          console.error(`[NCB API Error] Payload:`, JSON.stringify(this.body, null, 2));
        }
        return { data: null, error: json };
      }

      let finalData = json.data;
      if (json.data && json.data.hasOwnProperty('data') && Array.isArray(json.data.data)) {
        finalData = json.data.data;
      }

      if (this.isSingle && Array.isArray(finalData)) {
        finalData = finalData.length > 0 ? finalData[0] : null;
      }

      return { data: finalData, error: null };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  }

  then(onfulfilled?: (value: { data: T[] | T | null; error: any }) => any): Promise<any> {
    return this.exec().then(onfulfilled);
  }
}

export const createNcbClient = <D = Database>() => {
  let dataBase = `${PROXY_ROOT}/data`;
  let authBase = `${PROXY_ROOT}/auth`;

  if (!isBrowser) {
    if (process.env.NCB_DATA_API_URL) {
      dataBase = process.env.NCB_DATA_API_URL;
    } else {
      const host =
        process.env.NCB_API_BASE_URL || process.env.PUBLIC_API_URL || 'http://localhost:3000';
      dataBase = `${host.replace(/\/$/, '')}${PROXY_ROOT}/data`;
    }

    if (process.env.NCB_AUTH_API_URL) {
      authBase = process.env.NCB_AUTH_API_URL;
    } else {
      const host =
        process.env.NCB_API_BASE_URL || process.env.PUBLIC_API_URL || 'http://localhost:3000';
      authBase = `${host.replace(/\/$/, '')}${PROXY_ROOT}/auth`;
    }
  }

  const getAuthHeaders = () => {
    const headers: any = {
      'Content-Type': 'application/json',
      Origin: 'https://esgss-junaikey-beta.vercel.app',
    };

    if (!isBrowser && process.env.NCB_INSTANCE) {
      headers['X-Database-Instance'] = process.env.NCB_INSTANCE;
    }

    // In Node.js environment (scripts/backend): Use API Token (Secret Key)
    if (!isBrowser && process.env.NCB_API_TOKEN) {
      const rawToken = process.env.NCB_API_TOKEN;
      const token = rawToken.trim();

      // openapi.nocodebackend.com ingress requires secret_key.
      // Having BOTH secret_key and Authorization (JWT) causes a 403 "Invalid secret_key".
      // Also ensuring no dangling whitespace or unexpected Origin might trip some wafs.
      const ncbHeaders: any = {
        'Content-Type': 'application/json',
        'secret_key': token
      };

      if (process.env.NCB_INSTANCE) {
        ncbHeaders['X-Database-Instance'] = process.env.NCB_INSTANCE;
      }

      return ncbHeaders;
    }

    // In Browser or if no API token: Use Session Token (JWT)
    if (ncbSession && ncbSession.token) {
      headers['Authorization'] = `Bearer ${ncbSession.token}`;
    }

    return headers;
  };

  const getAuthUrl = (path: string) => {
    const cleanBase = authBase.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${cleanBase}${cleanPath}`;
    const searchParams = new URLSearchParams();
    if (!isBrowser && process.env.NCB_INSTANCE) {
      searchParams.set('Instance', process.env.NCB_INSTANCE);
    }
    if (!isBrowser && process.env.NCB_API_TOKEN) {
      searchParams.set('secret_key', process.env.NCB_API_TOKEN.trim());
    }
    const params = searchParams.toString();
    return params ? `${url}?${params}` : url;
  };

  const signIn = async () => {
    if (!isBrowser && process.env.NCB_USER_EMAIL && process.env.NCB_USER_PASSWORD) {
      try {
        const url = getAuthUrl('/sign-in/email');
        console.log('[NCB] Attempting sign in to:', url);
        const res = await fetch(url, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            email: process.env.NCB_USER_EMAIL,
            password: process.env.NCB_USER_PASSWORD,
          }),
        });
        const data = await res.json();
        console.log('[NCB] Sign in response:', JSON.stringify(data));
        if (data.session && data.session.token) {
          ncbSession = { token: data.session.token, userId: (data.user && data.user.id) || data.session.userId };
          console.log('[NCB] Session established with nested token');
        } else if (data.token) {
          ncbSession = { token: data.token, userId: data.user && data.user.id };
          console.log('[NCB] Session established with root token');
        } else if (data.error) {
          console.error('[NCB] Sign in error:', data.error);
        }
        return data;
      } catch (err) {
        console.error('[NCB] Sign in failed:', err);
        return { error: err };
      }
    }
    return { error: 'No credentials' };
  };

  if (!isBrowser) {
    initPromise = signIn().catch(console.error);
  }

  return {
    waitReady: () => initPromise || Promise.resolve(),
    from: (table: string) => new NcbQueryBuilder(table, dataBase),
    auth: {
      signIn,
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const url = getAuthUrl('/sign-in/email');
        const res = await fetch(url, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.session && data.session.token) {
          ncbSession = { token: data.session.token, userId: (data.user && data.user.id) || data.session.userId };
        } else if (data.token) {
          ncbSession = { token: data.token, userId: data.user && data.user.id };
        }
        return {
          data: data.user ? { user: data.user, session: data.session } : null,
          error: data.error,
        };
      },
      signUp: async ({
        email,
        password,
        options,
      }: {
        email: string;
        password: string;
        options?: any;
      }) => {
        const url = getAuthUrl('/sign-up/email');
        const res = await fetch(url, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            email,
            password,
            name: options && options.data && options.data.name,
          }),
        });
        const data = await res.json();
        return {
          data: data.user ? { user: data.user, session: data.session } : null,
          error: data.error,
        };
      },
      signOut: async () => {
        ncbSession = null;
        const url = getAuthUrl('/sign-out');
        await fetch(url, { method: 'POST', headers: getAuthHeaders() });
        return { error: null };
      },
      getSession: async () => {
        try {
          const url = getAuthUrl('/session');
          const res = await fetch(url, { headers: getAuthHeaders() });
          if (!res.ok) return { data: { session: null }, error: null };
          const data = await res.json();
          return { data: { session: data }, error: null };
        } catch {
          return { data: { session: null }, error: null };
        }
      },
    },
  };
};

export const ncb = createNcbClient();
