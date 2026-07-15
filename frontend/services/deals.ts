import { Deal } from "@/types";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

export class DealsServiceError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "DealsServiceError";
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let accessToken = typeof window !== "undefined" ? localStorage.getItem("apex_access_token") : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
    } catch (e) {}
    throw new DealsServiceError(response.status, errorMsg);
  }
  
  return response.json();
}

export const DealsService = {
  getDeals: async (): Promise<Deal[]> => {
    return fetchAPI<Deal[]>("/api/v1/decisions");
  },
  
  getDeal: async (id: string | number): Promise<Deal> => {
    return fetchAPI<Deal>(`/api/v1/decisions/${id}`);
  },
  
  createDeal: async (data: any): Promise<Deal> => {
    return fetchAPI<Deal>("/api/v1/decisions", { 
      method: "POST", 
      body: JSON.stringify(data) 
    });
  },

  uploadDeck: async (id: string | number, file: File): Promise<any> => {
    const url = `${API_BASE_URL}/api/v1/decisions/${id}/upload`;
    let accessToken = typeof window !== "undefined" ? localStorage.getItem("apex_access_token") : null;
    
    const headers: Record<string, string> = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMsg = errorData.detail;
      } catch (e) {}
      throw new DealsServiceError(response.status, errorMsg);
    }
    return response.json();
  },

  extractClaims: async (id: string | number, documentId: number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/documents/${documentId}/extract-claims`, {
      method: "POST"
    });
  },

  updateDeal: async (id: string | number, data: any): Promise<Deal> => {
    return fetchAPI<Deal>(`/api/v1/decisions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  runInvestorReview: async (id: string | number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/investor_review`, {
      method: "POST"
    });
  },

  getTimeline: async (id: string | number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/timeline`);
  },

  getCompare: async (id: string | number, v1: number, v2: number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/compare?v1=${v1}&v2=${v2}`);
  },

  getExecutiveSummary: async (id: string | number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/executive-summary`);
  },

  getSlideReview: async (id: string | number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/slide-review`);
  },

  getWorkQueue: async (id: string | number): Promise<any> => {
    return fetchAPI<any>(`/api/v1/decisions/${id}/work-queue`);
  }
};
