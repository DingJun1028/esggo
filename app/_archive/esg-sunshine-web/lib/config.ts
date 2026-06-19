export const API_CONFIG = {
  BASE_URL: 'https://openapi.nocodebackend.com',
  INSTANCE: '51694_esg_sunshine',
  // Bearer token should be stored in environment variables
  getAuthToken: () => process.env.NEXT_PUBLIC_API_TOKEN || '',
}

export const API_ENDPOINTS = {
  CONTACT_MESSAGES: {
    CREATE: `/create/contact_messages?Instance=${API_CONFIG.INSTANCE}`,
    READ: `/read/contact_messages?Instance=${API_CONFIG.INSTANCE}`,
    READ_BY_ID: (id: number) => `/read/contact_messages/${id}?Instance=${API_CONFIG.INSTANCE}`,
    SEARCH: `/search/contact_messages?Instance=${API_CONFIG.INSTANCE}`,
    UPDATE: (id: number) => `/update/contact_messages/${id}?Instance=${API_CONFIG.INSTANCE}`,
    DELETE: (id: number) => `/delete/contact_messages/${id}?Instance=${API_CONFIG.INSTANCE}`,
  },
}
