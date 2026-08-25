export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  patient_id: string;
  patient_name: string;
  items: InvoiceItem[];
  total_amount: number;
  status: string;
  issued_date: string;
  due_date: string;
}

export interface InvoiceCreate {
  patient_id: string;
  patient_name: string;
  items: InvoiceItem[];
  status: string;
  issued_date: string;
  due_date: string;
}
