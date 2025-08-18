import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Api} from '../api'
import {header, headers} from '../header';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  headers = new HttpHeaders({

    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  Api_Http = Api;
  constructor(private http: HttpClient) { }
  createPfEmployeeDetails(data):Observable<any> {
    return this.http.post(`${this.Api_Http}` + "/gf-employees ", data,{headers:this.header})
  }
  getPfEmployeeDetails():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/gf-employees ",{headers:this.header})
  }
  deletePfEmployeeDetailsById(id):Observable<any>{
    return this.http.delete(`${this.Api_Http}` + "/gf-employees/" + id,{headers:this.header})
  }
  getPfEmployeeById(id):Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/get-gf-employee-id/" + id,{headers:this.header})
  }
  updataPfEmployeeById(id,data) :Observable<any>{
    return this.http.put(`${this.Api_Http}` + "/gf-employees/" + id, data, {headers:this.header})
  }

  identificationType():Observable<any>{
    return this.http.get(`${this.Api_Http}` + "/identificationtypes",{headers:this.header})
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
  return this.http.get(`${this.Api_Http}` + "/nominees/" + id,{headers:this.header})
}
updataPfNomineeById(id,data):Observable<any> {
  return this.http.put(`${this.Api_Http}` + "/nominees/" + id, data, {headers:this.header})
}
}
