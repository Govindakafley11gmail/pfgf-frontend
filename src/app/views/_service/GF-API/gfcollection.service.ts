import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {header, headers} from '../header';
import { Api } from '../api';
@Injectable({
  providedIn: 'root'
})
export class GfcollectionService {

  headers = new HttpHeaders({

    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  // header = header;
  // headers = headers;
  // header.append('authentication'+ 'B' );
  Api_Http = Api;
  constructor(private http: HttpClient) { }

  createPfCollectionDetails(data): Observable<any> {
    console.log("second"+data);
    return this.http.post(`${this.Api_Http}` + "/gf-collections", data, { headers: this.header })
  }

  getPfCollectionDetails(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-collections", { headers: this.header })
  }
  getPfCollectionByUserBranch(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-gf-collection-receipt-by-user-branch", { headers: this.header })
  }
  getpendingDepositDataList() {
    return this.http.get(`${this.Api_Http}` + "/list-gf-pending-deposit-list", { headers: this.header })
  }
  getapprovedDepositDataList() {
    return this.http.get(`${this.Api_Http}` + "/list-gf-approved-deposits-list", { headers: this.header })
  }

  updataPfCollectionById(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/gf-collections/" + id, data, { headers: this.header })
  }

  getpfCompanyAcNoDetails(searchByCompanyAcNo): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-collections/" + searchByCompanyAcNo, { headers: this.header })
  }

  getCollectionAccoutByBranchId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getGfCollectionAccoutByBranchId/" + id, { headers: this.header })
  }

  getCollectionByCpmpanyId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getGfDueAmountByCompanyId/" + id, { headers: this.header })
  }

  // --------------------------collection individual deposit------------

  getcollectionReceiptNo(col_id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getGfCollectionReceiptNo/" + col_id, { headers: this.header })
  }
  downloadCollectionSlip(id) {
    return this.http.get(`${this.Api_Http}` + "/download-gf-collection-file/" + id, { headers: this.headers, responseType: 'blob' })
  }
  approvedtransaction(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/saveindividualgfdeposit", data, { headers: this.header })
  }
  //  -----report----------

  dailyCollectionList(generateCollectionReport) {
    return this.http.post(`${this.Api_Http}` + "/gf-daily-collection-report", generateCollectionReport, { headers: this.header })
  }

  monthlyDepositReportSearch(formdata) {
    return this.http.post(`${this.Api_Http}` + "/gf-monthly-deposit-statement", formdata, { headers: this.header })
  }

  companyWiseStatement(formdata) {
    return this.http.post(`${this.Api_Http}` + "/gf-company-wise-statement", formdata, { headers: this.header })
  }

  employeeWiseStatement(tableData) {
    return this.http.post(`${this.Api_Http}` + "/gf-employee-wise-statement", tableData, { headers: this.header })
  }

  trialBalanceReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/gf-trial-balance-statement", formdata, { headers: this.header })
  }

  accLedgerReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/gf-account-ledger-statement", formdata, { headers: this.header })
  }

  viewAllGeneratedReport(viewReport) {
    console.log(viewReport)
    return this.http.post(`${this.Api_Http}` + "/get-all-statements" , viewReport, { headers: this.header })
  }

  getAllMonth() {

    return this.http.get(`${this.Api_Http}` + "/months" , { headers: this.header })
  }

  downloadReport(docPath) {
    return this.http.get(`${this.Api_Http}` + "/download-statement/"+ docPath, { headers: this.headers, responseType: 'blob' })
  }
}
