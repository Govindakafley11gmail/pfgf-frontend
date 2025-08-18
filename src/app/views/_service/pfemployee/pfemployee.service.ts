import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Api} from '../api'
import {header, headers} from '../header';
import { LocalstorageService } from '../localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class PfemployeeService {
  // header = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  //   'Authorization': 'Bearer '+ localStorage.getItem('access_token')
  // })
  // header = header;
  // headers = headers;
  // header.append('authentication'+ 'B' );
  Api_Http = Api;
  constructor(private http: HttpClient, private localstorage: LocalstorageService) {console.log(this.localstorage.getItem('access_token')); }
  
    header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer '+ this.localstorage.getItem('access_token')
  })
  
  createPfEmployeeDetails(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/pfemployees ", data,{headers:this.header})
  }
  createGFEmployeeDetails(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-employees", data,{headers:this.header})
  }
  getPfEmployeeDetails():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/pfemployees",{headers:this.header})
  }
  findallemployee(){
    return this.http.get(`${this.Api_Http}` + "/findallemployee",{headers:this.header})
  }
  deletePfEmployeeDetailsById(id):Observable<any>{
    return this.http.delete(`${this.Api_Http}` + "/pfemployees/" + id,{headers:this.header})
  }
  getPfEmployeeById(id):Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/get-employee-id/" + id,{headers:this.header})
  }
  updataPfEmployeeById(id,data) :Observable<any>{
    return this.http.put(`${this.Api_Http}` + "/pfemployees/" + id, data, {headers:this.header})
  }

  identificationType():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/identificationtypes",{headers:this.header})
  }
  getAccountPostingList(){
    return this.http.get(`${this.Api_Http}` + "/get-all-Account-Posting",{headers:this.header})
  }
//  ---------------------pfNominee-------------------------
createPfNomineeDetails(data):Observable<any> {
  return this.http.post(`${this.Api_Http}` + "/nominees ", data,{headers:this.header})
}
getPfNomineeDetails(emp_id):Observable<any>{
  return this.http.get(`${this.Api_Http}` + "/get-nominee-id/"+emp_id,{headers:this.header})
}
deletePfNomineeDetailsById(id):Observable<any>{
  return this.http.delete(`${this.Api_Http}` + "/nominees/" + id,{headers:this.header})
}
getPfNomineeById(id):Observable<any>{
  return this.http.get(`${this.Api_Http}` + "/nominees/"+ id,{headers:this.header})
}
updataPfNomineeById(id,data):Observable<any> {
  return this.http.put(`${this.Api_Http}` + "/nominees/" + id, data, {headers:this.header})
}
}
