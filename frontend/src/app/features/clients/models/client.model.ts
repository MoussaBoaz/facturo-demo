export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  address?: string;
  total_invoices?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  company: string;
  phone: string;
  address?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
}
