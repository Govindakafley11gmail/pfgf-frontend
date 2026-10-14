import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Api } from './api';

export type RefundStatus = 'Verified' | 'loan_approved'

export interface Refund {
  refund_id: string;
  refund_company_id: string;
  refund_employee_id: string | null; // null for company-level refunds (e.g. Excess Payment Refund)
  refund_status: RefundStatus;
  refund_processed_remarks: string;
  refund_ref_no: string;
  refund_processing_date: string | null;
  refund_employee_contribution: number;
  refund_employer_contribution: number;
  refund_interest_on_employee_contr: number;
  refund_as_on_interest_employee: string | null;
  refund_interest_on_employer_contr: number;
  refund_as_on_interest_employer: string | null;
  refund_total_disbursed_amount: number;
  registration_type: 'EMPLOYEE' | 'COMPANY';
  org_name: string;
  company_account_no: string;
  employee_name: string | null;
  employee_id_no: string | null;
}

@Injectable({ providedIn: 'root' })
export class RefundService {
  private baseUrl = `${Api}`;

   constructor(private http: HttpClient) { }
    header = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
      'Access-Control-Allow-Origin':'*',
    });
    headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token'), 
    });
  getRefunds(status: RefundStatus | 'ALL'): Observable<any[]> {
    const params: Record<string, string> = {};
  
    return this.http.get<any>(this.baseUrl + '/refund-committee-approval-list/'+ status, { headers: this.headers });
  }

  getRefundsByRefNo(refund_ref_no: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/refund-data-list/${refund_ref_no}`, { headers: this.headers });
  }

  approveRefund( selectedRefunds: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refund-approved-by-committee`,   selectedRefunds , { headers: this.headers });
  }
}