export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  total?: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  client_id: number;
  client?: {
    id: number;
    name: string;
    email: string;
    company: string;
  };
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateInvoiceRequest {
  client_id: number;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  notes?: string;
  terms?: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];
}
