import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Api} from './api'
import {header, headers} from './header';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // header = header;
  // headers = headers;
  // header.append('authentication'+ 'B' );
  Api_Http = Api;
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
  postLoginData(crediential: any): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/login", crediential,{  withCredentials: false
});
  }
  logout() {
    const crediential = '';
    return this.http.post<any>(`${this.Api_Http}` + "/logout",crediential, { headers: this.header });
  }
  logoutLogin(token: string) {
    const crediential = '';
    return this.http.post<any>(`${this.Api_Http}` + "/logout",crediential, { headers:   new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': 'Bearer ' + token,
      'Access-Control-Allow-Origin':'*',
    })
   });
  }
  
  createuser(users: any): Observable<any> {
    return this.http.post<any>(`${this.Api_Http}` + "/register", users);
  }
  insideCreateUser(users: any) {
    console.log(users)
    return this.http.post(`${this.Api_Http}` + "/users", users, { headers: this.header });
  }
  searchuser(formData: any){
        return this.http.post(`${this.Api_Http}` + "/search-employee-details", formData, { headers: this.header });

  }
  //changepassword
  ChangeUserPassword(changepassword: any) {
    return this.http.post(`${this.Api_Http}` + "/forgot-password-mail", changepassword);
  }
  ChangeUserOTP(otp: any) {
    return this.http.post(`${this.Api_Http}` + "/verify-otp", otp, { headers: this.header });
  }
  submitToChangePassword(changepassword: any) {
    return this.http.post(`${this.Api_Http}` + "/update-forgot-password", changepassword, { headers: this.header });
  }
  listBranchWithoutAuth() {

    return this.http.get(`${this.Api_Http}` + "/branche");
  }

  listDepartmentWithoutAuth() {

    return this.http.get(`${this.Api_Http}` + "/department");
  }
  createDepartment(departmentname): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/departments", departmentname, { headers: this.header });
  }
  listDepartname(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/departments", { headers: this.header });
  }
  deleteDepartmentById(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/departments/" + id, { headers: this.header });
  }
  editDepartmentList(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/departments/" + id, { headers: this.header });
  }
  updateDepartment(data): Observable<any> {

    return this.http.put(`${this.Api_Http}` + "/departments/" + data.department_id, data, { headers: this.header });
  }


  crerateBranch(createBranch): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/branches", createBranch, { headers: this.header });
  }
  getBranchlist(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/branches", { headers: this.header });
  }
  deleteBranch(deletebeanch): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/branches" + "/" + deletebeanch, { headers: this.header });
  }
  editBranch(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/branches/" + id, { headers: this.header });
  }
  updateBranch(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/branches/" + id, data, { headers: this.header });
  }


  createPermission(createPermission): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/permissions", createPermission, { headers: this.header });
  }
  listPermission() {
    return this.http.get(`${this.Api_Http}` + "/permissions", { headers: this.header });
  }
  deletePermission(id): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/permissions/" + id, { headers: this.header });
  }
  editPermission(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/permissions/" + id, { headers: this.header });
  }
  updatePermission(data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/permissions/" + data.id, data, { headers: this.header });
  }


  getDepartment(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/departments", { headers: this.header });
  }
  listuser(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/users", { headers: this.header });
  }

  editUser(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/users/" + id+"/edit", { headers: this.header });
  }
  editAllUserWithoutAuth(id) {
    return this.http.get(`${this.Api_Http}` + "/get-permission-list-by-user-id/" + id, { headers: this.header });
  }


  createRole(createrole): Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/roles", createrole, { headers: this.header });
  }
  getRole(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/roles", { headers: this.header });
  }
  deleteRoles(deleterole): Observable<any> {
    return this.http.delete(`${this.Api_Http}` + "/roles/" + deleterole, { headers: this.header });
  }
  editRole(id): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/roles/" + id, { headers: this.header });
  }
  updateRole(id, data): Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/roles/" + id, data, { headers: this.header });
  }
  fetchRoleByUserId(id) {
    return this.http.get(`${this.Api_Http}` + "/listrolebyuserid/" + id, { headers: this.header });
  }
  fetchPermissionByUserId(id) {
    return this.http.get(`${this.Api_Http}` + "/listpermissionbyuserid/" + id, { headers: this.header });
  }

  fetchPermissionByRoleId(id) {
    return this.http.get(`${this.Api_Http}` + "/listpermissionbyroleid/" + id, { headers: this.header });
  }
  updateUserById(userData) {
    return this.http.put(`${this.Api_Http}` + "/users/" + userData.id, userData, { headers: this.header });
  }
  
  deleteUser(deleteUser) {
    return this.http.delete(`${this.Api_Http}` + "/users/" + deleteUser, { headers: this.header });
  }

  // fetchDataSectorWise
  fetchDataSectorWise(): Observable<any> {
    return this.http.get(`${this.Api_Http}` + "/sector-type-list", { headers: this.header });
  }

  listBranchById(id) {
    return this.http.get(`${this.Api_Http}` + "/department-by-branch-id/" + id, { headers: this.header });
  }

  getUserByCid(cid) :Observable<any>{
    return  this.http.get<any>(`${this.Api_Http}` + "/list-user-by-cid/" + cid, { headers: this.header });
  }

  updateUserProfile(createUsers):Observable<any> {
    return this.http.put(`${this.Api_Http}` + "/update-user-profile/" + createUsers.id, createUsers, { headers: this.header });
  }
  UpdatePassword(UpdatePassword) {
    return this.http.post(`${this.Api_Http}` + "/change-password", UpdatePassword, { headers: this.header });
  }

  downloadResourcesForm(event){
    return this.http.get(`${this.Api_Http}` + "/get-resource-file/"+event, { headers: this.headers, responseType: 'blob' })
  }
}
