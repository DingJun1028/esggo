/**
 * CSRF Service for Frontend
 * Handles CSRF token fetching and injection into API requests
 */

let csrfToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Fetch CSRF token from backend
 * Automatically refreshes if token is expired
 */
export async function fetchCsrfToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid
    if (csrfToken && tokenExpiry > now) {
        return csrfToken;
    }

    try {
        const response = await fetch('/api/csrf-token', {
            method: 'GET',
            credentials: 'include', // Important: Include cookies
        });

        if (!response.ok) {
            throw new Error(`CSRF token fetch failed: ${response.statusText}`);
        }

        const data = await response.json();
        csrfToken = data.csrfToken;
        tokenExpiry = now + (data.expiresIn * 1000) - 60000; // Refresh 1 min before expiry

        console.log('✅ CSRF token fetched successfully');
        return csrfToken;
    } catch (error) {
        console.error('❌ Failed to fetch CSRF token:', error);
        throw error;
    }
}

/**
 * API POST with CSRF protection
 */
export async function apiPost<T = any>(url: string, body: any): Promise<T> {
    const token = await fetchCsrfToken();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': token,
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

/**
 * API PUT with CSRF protection
 */
export async function apiPut<T = any>(url: string, body: any): Promise<T> {
    const token = await fetchCsrfToken();

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': token,
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

/**
 * API DELETE with CSRF protection
 */
export async function apiDelete<T = any>(url: string): Promise<T> {
    const token = await fetchCsrfToken();

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'CSRF-Token': token,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

/**
 * API PATCH with CSRF protection
 */
export async function apiPatch<T = any>(url: string, body: any): Promise<T> {
    const token = await fetchCsrfToken();

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': token,
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

/**
 * Clear cached token (use when user logs out)
 */
export function clearCsrfToken() {
    csrfToken = null;
    tokenExpiry = 0;
}
