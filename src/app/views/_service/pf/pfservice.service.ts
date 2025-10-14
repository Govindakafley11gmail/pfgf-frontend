import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Api} from '../api';
import {header, headers} from '../header';
@Injectable({
  providedIn: 'root'
})
export class PfserviceService {

  constructor(private http: HttpClient) { }
  Api_Http = Api;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })

  header = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  // header = header;
  // headers = headers;

  // Organization Type Lists
  orgtypes() :Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/orgtypes",{ headers: this.headers })
  }
  findAllCompany(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/policylist", { headers: this.headers })
  }
  PFcompaneyRegistrationList(): Observable<any> {
    console.log(headers)
    return this.http.get(`${this.Api_Http}` + "/pfcompanies", { headers: this.headers })
  }
  GFcompaneyRegistrationList():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/gf-companies", { headers: this.headers })
  }
  findcompanyById(data){
      return this.http.post(`${this.Api_Http}` + "/findcompany", data, { headers: this.headers })

  }
  editPfCompaneyById(id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/pfcompanies/" + id+'/edit', { headers: this.headers })
  }

  pfCompaneyRegistration(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/pfcompanies", data, { headers: this.headers })
  }
  updatepfCompaneyRegistration(id,data):Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/pfcompanies/" + id, data, { headers: this.headers })
  }
  getAllDzongkhag() :Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/dzongkhaglist", { headers: this.headers })
  }

  deletePfOrganizationCompaney(id):Observable<any> {
    return this.http.delete(`${this.Api_Http}` + '/pfcompanies/' + id, { headers: this.headers });
  }
  createPropriter(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/proprietors", data, { headers: this.headers })
  }
  getPropriterDetails() :Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/proprietors", { headers: this.header })
  }
  deletePropriterById(id):Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/proprietors/" + id, { headers: this.headers })
  }
  getPropriterById(id) :Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/proprietors/" + id, { headers: this.headers })
  }
  getPropriterByCompanyId(id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getproprietorbycompanyid/" + id, { headers: this.headers })
  }
  updatePropriteById(id, data) :Observable<any>{
    return this.http.put(`${this.Api_Http}` + "/proprietors/" + id, data, { headers: this.headers })
  }

  createContactPersionDEtails(data) :Observable<any>{
    return this.http.post(`${this.Api_Http}` + "/contactpersons", data, { headers: this.headers })
  }
  getContactPersionCompanyId(id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getcontactpersoncompanyid/"+id, { headers: this.headers })
  }

  deleteContactPersionDEtailsById(id) :Observable<any>{
    return this.http.delete(`${this.Api_Http}` + "/contactpersons/" + id, { headers: this.headers })
  }
  getContactPersonById(id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/contactpersons/" + id, { headers: this.headers })
  }

  updateContactPeronById(id, data):Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/contactpersons/" + id, data, { headers: this.headers })
  }

  CreateIntroducer(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/introducers", data, { headers: this.headers })
  }
  getIntroducersByCompanyId(id) :Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/getintroducerbycompanyid/"+id, { headers: this.headers })
  }
  deleteIntroducers(id) :Observable<any>{
    return this.http.delete(`${this.Api_Http}` + "/introducers/" + id, { headers: this.headers })
  }
  getIntroducresById(id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/introducers/" + id, { headers: this.headers })
  }
  updateIntroducers(id, data):Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/introducers/" + id, data, { headers: this.headers })
  }

  // ---------------refund-----------------

  getEmployeeNameByCompanyName():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/getactivepfcompanylist" , { headers: this.headers })
  }
  getByEmployeeName(comp_id):Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/get-employee-list-by-company-id/" + comp_id, { headers: this.headers })
  }

  getActiveEmployeeByCompId(comp_id):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/getactivepfemployeelist/" + comp_id, { headers: this.headers })
  }

  getrefundbyemployeeid(emp_cid_no):Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/get-refund-by-employee-id-no/" + emp_cid_no, { headers: this.headers})
  }

  savePfRefund(data):Observable<any>{
    return this.http.post<any>(`${this.Api_Http}` + "/refunds", data, { headers: this.header })
  }
  getRefundDetails(): Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/refund-processed-list", { headers: this.header })
  }
  
  getRefundVarifiedDetails(): Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/refund-payment-Varified-list", { headers: this.header })
  }
  approvedRefundByRefNo(ref_id): Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/refund-data-list/" + ref_id, { headers: this.header })
  }
  refundApprovalListByRefundRefNo(ref_id){
    return this.http.get(`${this.Api_Http}` + "/refund-approval-list/" + ref_id, { headers: this.header })
  }
  approvedfRefund(data):Observable<any>{
    return this.http.post<any>(`${this.Api_Http}` + "/refund-approve", data, { headers: this.header })
  }
  verifyRefund(refund_ref_no):Observable<any> {
    return this.http.get<any>(`${this.Api_Http}` + "/verify-refund/"+ refund_ref_no, { headers: this.header })
  }
  getAllApprovedData(){
    return this.http.get(`${this.Api_Http}` + "/refund-approve-list", { headers: this.header })
  }
  downloadRefundFile(path){
    return this.http.get(`${this.Api_Http}` + "/download-refund-file/"+path,{ headers: this.header, responseType: 'blob' })
  }
  revertAccountTransaction(formdata: string){
    return this.http.post(`${this.Api_Http}` + "/reversed-Account-Posting",  formdata , { headers: this.header });
  }

  getpfEmployeeById(emp_id){

    return this.http.get(`${this.Api_Http}` + "/get-employee-data-by-pf-emp-id/"+emp_id, { headers: this.header })
  }
  getRefundAdviseDetails() {
    return this.http.get(`${this.Api_Http}` + "/refund-payment-list", { headers: this.header })
  }

  ChangeRefunfAdviseNoDeposit( changeRefunfAdviseNo){
    return this.http.get(`${this.Api_Http}` + "/refund-paymentdetail-lists/"+changeRefunfAdviseNo, { headers: this.header })
  }
  
  viewCompletedDataList(refNo):Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/refund-paymentdetail-completed-lists/"+refNo, { headers: this.header })
  }
  savePaymentRefund(data):Observable<any>{
    return this.http.post<any>(`${this.Api_Http}` + "/refund-payment", data, { headers: this.headers})
  }

  savePaymentExcessRefund(data):Observable<any> {
    return this.http.post<any>(`${this.Api_Http}` + "/excess-payment", data, { headers: this.headers})
  }

  pendingPament(){
    return this.http.get(`${this.Api_Http}` + "/refund-payment-pending-list", { headers: this.headers })
  }
  getAllApprovedPayment(company_id){
    return this.http.get(`${this.Api_Http}` + "/refund-payment-completed-list/"+company_id, { headers: this.headers })
  }

  getAllsettledPayment(){
    return this.http.get(`${this.Api_Http}` + "/refund-payment-settled-list", { headers: this.headers })
  }

  getbyPaymentAdviseNo(paymentAdviseNo){
    return this.http.get(`${this.Api_Http}` + "/get-payment-document/"+paymentAdviseNo, { headers: this.headers })
  }

  refundCompletedList(){
    return this.http.get(`${this.Api_Http}` + "/refund-completed-list", { headers: this.headers })
  }
//get collection by company id
  getCollectionPendingdataByCompanyId(company_id){
    return this.http.get(`${this.Api_Http}` + "/list-pending-collections/"+company_id, { headers: this.headers })
  }
//get collection by receipt no
  getCollectionPendingcollectionReceiptNo(collection_no) {
    return this.http.get(`${this.Api_Http}` + "/pending-collections-data/"+collection_no, { headers: this.headers })
  }
//submit excess refud
  createExcessPffund(formdata) {
    return this.http.post<any>(`${this.Api_Http}` + "/create-excess-refund-payment", formdata, { headers: this.headers })
  }
  //get All excess fefund
  getAllExcessRefund(){
    return this.http.get(`${this.Api_Http}` + "/get-all-excess-refund", { headers: this.headers })
  }

  //transfer employee
  transferEmployeeToAnotherExtension(formdata) {
    return this.http.post<any>(`${this.Api_Http}` + "/employee-transfer", formdata, { headers: this.headers })
  }

  //note sheet
  generateNotesheet(notesheet){
    return this.http.post(`${this.Api_Http}` + "/generate-refund-notesheet",notesheet,{ headers: this.header })
  }
}
