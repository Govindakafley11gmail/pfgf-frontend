import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Api} from '../api'
import {header, headers} from '../header';
@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  Api_Http = Api;
  header = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  userNotification(user_id) {
    return this.http.get(`${this.Api_Http}` + "/password-notify/" + user_id, { headers: this.headers })
  }
  // Organization Type Lists
  orgtypes(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/orgtypes", { headers: this.headers })
  }

  PFcompaneyRegistrationList(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-companies", { headers: this.headers })
  }

  editPfCompaneyById(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-companies/" + id + '/edit', { headers: this.headers })
  }

  gfCompaneyRegistration(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-companies", data, { headers: this.headers })
  }
  updategfCompaneyRegistration(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/gf-companies/" + id, data, { headers: this.headers })
  }
  getAllDzongkhag(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/dzongkhaglist", { headers: this.headers })
  }

  deletePfOrganizationCompaney(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + '/gf-companies/' + id, { headers: this.headers });
  }
  createPropriter(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-proprietors", data, { headers: this.headers })
  }
  getPropriterDetails(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-proprietors", { headers: this.headers })
  }
  deletePropriterById(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/gf-proprietors/" + id, { headers: this.headers })
  }
  getPropriterById(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-proprietors/" + id, { headers: this.headers })
  }
  getPropriterByCompanyId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-gf-proprietor-by-companyid/" + id, { headers: this.headers })
  }
  updatePropriteById(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/gf-proprietors/" + id, data, { headers: this.headers })
  }

  createContactPersionDEtails(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-contactpersons", data, { headers: this.headers })
  }
  getContactPersionCompanyId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-gf-contactperson-companyid/" + id, { headers: this.headers })
  }

  deleteContactPersionDEtailsById(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/gf-contactpersons/" + id, { headers: this.headers })
  }
  getContactPersonById(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-contactpersons/" + id, { headers: this.headers })
  }

  updateContactPeronById(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/gf-contactpersons/" + id, data, { headers: this.headers })
  }

  CreateIntroducer(data): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-introducers", data, { headers: this.headers })
  }
  getIntroducersByCompanyId(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-gf-introducer-by-companyid/" + id, { headers: this.headers })
  }
  deleteIntroducers(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/gf-introducers/" + id, { headers: this.headers })
  }
  getIntroducresById(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/gf-introducers/" + id, { headers: this.headers })
  }
  updateIntroducers(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/gf-introducers/" + id, data, { headers: this.headers })
  }

  // ---------------refund-----------------

  getEmployeeNameByCompanyName(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getactive-gf-companylist", { headers: this.headers })
  }

  getByEmployeeName(emp_id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getactivepfemployeelist/" + emp_id, { headers: this.headers })
  }

  getrefundbyemployeeid(emp_cid_no): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/get-gf-refund-by-employee-id-no/" + emp_cid_no, { headers: this.headers })
  }

  savePfRefund(data): Observable<any> {
    return this.http.post<any>(`${this.Api_Http}` + "/gf-refund-process", data, { headers: this.header })
  }

  getRefundDetails(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/refund-processed-list", { headers: this.headers })
  }

  approvedRefundByRefNo(ref_id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/refund-data-list/" + ref_id, { headers: this.headers })
  }

  approvedfRefund(data): Observable<any> {
    return this.http.post<any>(`${this.Api_Http}` + "/refund-gf-approve", data, { headers: this.header })
  }

  getAllApprovedData() {
    return this.http.get(`${this.Api_Http}` + "/refund-approve-list", { headers: this.headers })
  }

  downloadRefundFile(path) {
    return this.http.get(`${this.Api_Http}` + "/download-refund-file/" + path, { headers: this.header, responseType: 'blob' })
  }

  getpfEmployeeById(emp_id) {

    return this.http.get(`${this.Api_Http}` + "/get-employee-data-by-pf-emp-id/" + emp_id, { headers: this.headers })
  }

  getRefundAdviseDetails() {
    return this.http.get(`${this.Api_Http}` + "/refund-payment-list", { headers: this.headers })
  }

  ChangeRefunfAdviseNoDeposit(changeRefunfAdviseNo) {
    return this.http.get(`${this.Api_Http}` + "/refund-paymentdetail-lists/" + changeRefunfAdviseNo, { headers: this.headers })
  }

  savePaymentRefund(data) {
    return this.http.post<any>(`${this.Api_Http}` + "/refund-payment", data, { headers: this.headers })
  }

  verifyRefund(refund_ref_no): Observable<any> {
    return this.http.get<any>(`${this.Api_Http}` + "/verify-gf-refund/" + refund_ref_no, { headers: this.headers })
  }

  refundApprovalListByRefundRefNo(ref_id) {
    return this.http.get(`${this.Api_Http}` + "/refund-approval-list/" + ref_id, { headers: this.headers })
  }

  getActiveEmployeeByCompId(comp_id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getactivepfemployeelist/" + comp_id, { headers: this.headers })
  }

  pendingPament() {
    return this.http.get(`${this.Api_Http}` + "/refund-payment-pending-list", { headers: this.headers })
  }

  getAllApprovedPayment() {
    return this.http.get(`${this.Api_Http}` + "/refund-payment-completed-list", { headers: this.headers })
  }

  refundCompletedList() {
    return this.http.get(`${this.Api_Http}` + "/refund-completed-list", { headers: this.headers })
  }

  // dashboardData
  // pfcompany dashboardData
  CountPfCompanyList() {
    return this.http.get(`${this.Api_Http}` + "/pf-company-count", { headers: this.headers })
  }

  // pfcompany dashboardData
  CountGFCompanyList() {
    return this.http.get(`${this.Api_Http}` + "/gf-company-count", { headers: this.headers })
  }
  // pfemployee dashboardData
  CountPfEmployeeList() {
    return this.http.get(`${this.Api_Http}` + "/pf-individual-count", { headers: this.headers })
  }
  // gfemployee dashboardData
  CountGfEmployeeList() {
    return this.http.get(`${this.Api_Http}` + "/gf-individual-count", { headers: this.headers })
  }
  // TotalCollectionAmount dashboardData
  TotalCollectionAmount() {
    return this.http.get(`${this.Api_Http}` + "/total-collection-amount", { headers: this.headers })
  }
  // TotalRefundAmount dashboardData
  TotalRefundAmount() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }

  // getTotalPFCollectionMonth
  getTotalPFCollectionMonth() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
  // getTotalGFCollectionMonth
  getTotalGFCollectionMonth() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
  // getTotalPFRefundMonth
  getTotalPFRefundMonth() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
  // getTotalGFrefundMonth
  getTotalGFrefundMonth() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
  // getTotalPFCollectionYear
  getTotalPFContribution() {
    return this.http.get(`${this.Api_Http}` + "/monthly-pf-contributions", { headers: this.headers })
  }
  // getTotalGFCollectionYear
  getTotalGFContribution() {
    return this.http.get(`${this.Api_Http}` + "/monthly-gf-contributions", { headers: this.headers })
  }
  // getTotalPFRefundYear
  getTotalPFRefundYear() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
  // getTotalGFrefundYear
  getTotalGFrefundYear() {
    return this.http.get(`${this.Api_Http}` + "/total-refund-amount", { headers: this.headers })
  }
}
