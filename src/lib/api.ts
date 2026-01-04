// API Client pour communiquer avec le backend

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Une erreur est survenue',
      }));
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  // Auth
  async sendMagicLink(email: string) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(token: string) {
    return this.request<{ token: string; user: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async getCurrentUser(token: string) {
    return this.request('/auth/me', {
      method: 'GET',
      token,
    });
  }

  // Ebooks
  async createEbook(data: any, token: string) {
    return this.request('/ebooks', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async getEbooks(token: string) {
    return this.request('/ebooks', {
      method: 'GET',
      token,
    });
  }

  async getEbook(id: string, token: string) {
    return this.request(`/ebooks/${id}`, {
      method: 'GET',
      token,
    });
  }

  async updateEbook(id: string, data: any, token: string) {
    return this.request(`/ebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteEbook(id: string, token: string) {
    return this.request(`/ebooks/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async publishEbook(id: string, token: string) {
    return this.request(`/ebooks/${id}/publish`, {
      method: 'POST',
      token,
    });
  }

  async getPublicEbook(slug: string) {
    return this.request(`/ebooks/public/${slug}`, {
      method: 'GET',
    });
  }

  // AI
  async chat(message: string, context: string | undefined, token: string) {
    return this.request<{ response: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
      token,
    });
  }

  async improveContent(content: string, instruction: string, token: string) {
    return this.request<{ improved: string }>('/ai/improve', {
      method: 'POST',
      body: JSON.stringify({ content, instruction }),
      token,
    });
  }

  // User
  async getDashboardStats(token: string) {
    return this.request('/users/dashboard', {
      method: 'GET',
      token,
    });
  }

  async updateProfile(data: any, token: string) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  // Payments
  async createSubscription(priceId: string, token: string) {
    return this.request<{ sessionId: string; url: string }>(
      '/payments/subscription',
      {
        method: 'POST',
        body: JSON.stringify({ priceId }),
        token,
      }
    );
  }

  async createEbookCheckout(ebookId: string, amount: number) {
    return this.request<{ sessionId: string; url: string }>(
      '/payments/ebook',
      {
        method: 'POST',
        body: JSON.stringify({ ebookId, amount }),
      }
    );
  }
}

export const api = new ApiClient(API_URL);
export default api;
