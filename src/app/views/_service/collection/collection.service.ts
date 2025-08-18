import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Api} from '../api'
import {header, headers} from '../header';
@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  // header.append('authentication'+ 'B' );
  // header = header;
  // headers = headers;
  Api_Http = Api;
  constructor(private http: HttpClient) { }
  
  generateCollectionReport(pf_collection_id) : Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/get-collections-by-col-id/"+pf_collection_id, { headers: this.headers , responseType: 'blob'})
  }

  createPfCollectionDetails(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/pfcollections", data, { headers: this.header })
  }

  getPfCollectionDetails(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/pfcollections", { headers: this.header })
  }
  getPfCollectionByUserBranch(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-collection-receipt-by-user-branch", { headers: this.header })
  }
  getpendingDepositDataList() {
    return this.http.get(`${this.Api_Http}` + "/list-pending-deposit-list", { headers: this.header })
  }
  getapprovedDepositDataList() {
    return this.http.get(`${this.Api_Http}` + "/list-approved-deposits-list", { headers: this.header })
  }

  generateDocument(data) {
    return this.http.post(`${this.Api_Http}` + "/get-individual-deposit-details",data, { headers: this.headers , responseType: 'blob'})
  }

  updataPfCollectionById(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/pfcollections/" + id, data, { headers: this.header })
  }

  getpfCompanyAcNoDetails(searchByCompanyAcNo): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/pfcollections/" + searchByCompanyAcNo, { headers: this.header })
  }

  getCollectionAccoutByBranchId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getCollectionAccoutByBranchId/" + id, { headers: this.header })
  }

  getCollectionByCpmpanyId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getDueAmountByCompanyId/" + id, { headers: this.header })
  }

  // --------------------------collection individual deposit------------

  getcollectionReceiptNo(col_id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getCollectionReceiptNo/" + col_id, { headers: this.header })
  }

  getGfCollectionReceiptNo(col_id) {
    return this.http.get(`${this.Api_Http}` + "/getGfCollectionReceiptNo/" + col_id, { headers: this.header })
  }

  getCollectionBtCollectionId(col_id) {
    return this.http.get(`${this.Api_Http}` + "/view-approved-deposits/" + col_id, { headers: this.header })
  }

  downloadCollectionSlip(id) {
    return this.http.get(`${this.Api_Http}` + "/download-collection-file/" + id, { headers: this.headers, responseType: 'blob' })
  }
  approvedtransaction(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/saveindividualdeposit", data, { headers: this.header })
  }

  approvedGfTransaction(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/saveindividualgfdeposit", data, { headers: this.header })
  }
  //  -----report----------

  dailyCollectionList(generateCollectionReport) {
    return this.http.post(`${this.Api_Http}` + "/generate-daily-collection-report", generateCollectionReport, { headers: this.header })
  }
  NewCompanyListReport(formData) {
    return this.http.post(`${this.Api_Http}` + "/new-company-report", formData, { headers: this.header })
  }
  CompanyWiseRemittanceDueReport(formData) {
    return this.http.post(`${this.Api_Http}` + "/company-wise-remittance-report", formData, { headers: this.header })
  }
  monthlyDepositReportSearch(formdata) {
    return this.http.post(`${this.Api_Http}` + "/monthly-deposit-statement", formdata, { headers: this.header })
  }

  companyWiseStatement(formdata) {
    return this.http.post(`${this.Api_Http}` + "/company-wise-statement", formdata, { headers: this.header })
  }

  employeeWiseStatement(tableData) {
    return this.http.post(`${this.Api_Http}` + "/employee-wise-statement", tableData, { headers: this.header })
  }
  monthlyPendingReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/monthly-refund-pending-report", formdata, { headers: this.header })
  }
  ActiveOrInactiveEmployeeList(data){
    return this.http.post(`${this.Api_Http}` + "/get-all-inactive-user-report", data, { headers: this.header })
  }
companyListWithintroducerReport(formData){
  return this.http.post(`${this.Api_Http}` + "/get-all-introducer-report", formData, { headers: this.header })
}
  trialBalanceReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/trial-balance-statement", formdata, { headers: this.header })
  }

  accLedgerReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/account-ledger-statement", formdata, { headers: this.header })
  }

  mouRenewalReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/mou-renewal-list-report", formdata, { headers: this.header })
  }

  companyWisefundReport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/company-wise-fundbalance-report", formdata, { headers: this.header })
  }

  monthlyRefundreport(formdata) {
    return this.http.post(`${this.Api_Http}` + "/monthly-refund-report", formdata, { headers: this.header })
  }
  monthlyLabourReportSearch(formdata) {
    return this.http.post(`${this.Api_Http}` + "/monthly-labor-report", formdata, { headers: this.header })
  }
  monthlyClosingReportSearch(formdata) {
    return this.http.post(`${this.Api_Http}` + "/closing-report", formdata, { headers: this.header })
  }
  BRMReportSearch(formdata) {
    return this.http.post(`${this.Api_Http}` + "/brm-data-report", formdata, { headers: this.header })
  }
  //-----------report ned-----
  viewAllGeneratedReport(viewReport) {
    console.log(`${this.Api_Http}` + "/get-all-statements", viewReport)
    return this.http.post(`${this.Api_Http}` + "/get-all-statements", viewReport, { headers: this.header })
  }

  getAllMonth() {

    return this.http.get(`${this.Api_Http}` + "/months", { headers: this.header })
  }

  downloadReport(docPath) {
    return this.http.get(`${this.Api_Http}` + "/download-statement/" + docPath, { headers: this.headers, responseType: 'blob' })
  }

  //accountposting

  searchAlltheAccountPostingData(formData) {
    return this.http.post(`${this.Api_Http}` + "/get-account-posting-search", formData, { headers: this.header })
  }
  ///get-account-posting-refno
  searchAccountpostingByReferenceNumber(formData) {
    return this.http.post(`${this.Api_Http}` + "/get-account-posting-refno", formData, { headers: this.header })
  }

  //account posting
  AccountPosting(formData) {
    return this.http.post(`${this.Api_Http}` + "/save-account-posting", formData, { headers: this.header })
  }

  //reversed bi col id
  reversedColBycolId(collectionid) {
    return this.http.get(`${this.Api_Http}` + "/reverse-collection-data/" + collectionid, { headers: this.header })
  }
  //save rev collection

  saveReversedCollection(formdata) {
    return this.http.post(`${this.Api_Http}` + "/reverse-collections", formdata, { headers: this.header })
  }

  //saveTransaction
  updateEmployee(formdata) {
    return this.http.post(`${this.Api_Http}` + "/update-individual-employee-deposit", formdata, { headers: this.header })
  }
}
