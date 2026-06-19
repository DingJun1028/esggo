import { API_CONFIG, API_ENDPOINTS } from '../config'

export interface ContactMessageData {
  name: string
  job_title?: string
  email: string
  phone?: string
  company_name?: string
  subject: '課程諮詢' | '企業內訓' | 'esg顧問服務' | '合作洽談' | '其它'
  message: string
}

export interface ContactMessageResponse {
  status: string
  message?: string
  id?: number
}

export interface ContactMessageError {
  error: string
  details?: string
}

export class ContactAPI {
  private static async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = API_CONFIG.getAuthToken()

    if (!token) {
      throw new Error('API token is not configured')
    }

    const url = `${API_CONFIG.BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `API request failed with status ${response.status}`
      )
    }

    return response.json()
  }

  static async createContactMessage(
    data: ContactMessageData
  ): Promise<ContactMessageResponse> {
    return this.fetchAPI<ContactMessageResponse>(
      API_ENDPOINTS.CONTACT_MESSAGES.CREATE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  static async getContactMessages(): Promise<{
    status: string
    data: ContactMessageData[]
  }> {
    return this.fetchAPI(API_ENDPOINTS.CONTACT_MESSAGES.READ)
  }

  static async getContactMessageById(id: number): Promise<{
    status: string
    data: ContactMessageData
  }> {
    return this.fetchAPI(API_ENDPOINTS.CONTACT_MESSAGES.READ_BY_ID(id))
  }

  static async searchContactMessages(
    searchCriteria: Partial<ContactMessageData>
  ): Promise<{
    status: string
    data: ContactMessageData[]
  }> {
    return this.fetchAPI(API_ENDPOINTS.CONTACT_MESSAGES.SEARCH, {
      method: 'POST',
      body: JSON.stringify(searchCriteria),
    })
  }

  static async updateContactMessage(
    id: number,
    data: Partial<ContactMessageData>
  ): Promise<{ status: string; message?: string }> {
    return this.fetchAPI(API_ENDPOINTS.CONTACT_MESSAGES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async deleteContactMessage(
    id: number
  ): Promise<{ status: string; message?: string }> {
    return this.fetchAPI(API_ENDPOINTS.CONTACT_MESSAGES.DELETE(id), {
      method: 'DELETE',
    })
  }
}
