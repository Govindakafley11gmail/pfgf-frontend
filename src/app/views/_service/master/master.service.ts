import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Api} from '../api'
import {header, headers} from '../header';
@Injectable({
  providedIn: 'root'
})
export class MasterService {
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
  createStakeHolderDetails(data) {
    return this.http.post(`${this.Api_Http}` + "/stakeholders", data, { headers: this.header })
  }
  getStakeHolderDetails() {
    return this.http.get(`${this.Api_Http}` + "/stakeholders", { headers: this.header })
  }
  deleteStakeHolderDetailsById(id) {
    return this.http.delete(`${this.Api_Http}` + "/stakeholders/" + id, { headers: this.header })
  }
  getStakeHolderById(id) {
    return this.http.get(`${this.Api_Http}` + "/stakeholders/" + id, { headers: this.header })
  }
  updataStakeHolderById(id, data) {
    return this.http.put(`${this.Api_Http}` + "/stakeholders/" + id, data, { headers: this.header })
  }

  // -------------Account Group--------------

  createAccountGroupDetails(data) {
    return this.http.post(`${this.Api_Http}` + "/accountgroups", data, { headers: this.header })
  }
  getAccountGroupDetails() {
    return this.http.get(`${this.Api_Http}` + "/accountgroups", { headers: this.header })
  }

  getAccountTypeDetailsBygroupCode(groupcode){
    return this.http.get(`${this.Api_Http}` + "/get-account-type-name/" + groupcode, { headers: this.header })
  }

  deleteAccountGroupById(id) {
    return this.http.delete(`${this.Api_Http}` + "/accountgroups/" + id, { headers: this.header })
  }
  getAccountGroupById(id) {
    return this.http.get(`${this.Api_Http}` + "/accountgroups/" + id, { headers: this.header })
  }
  updateAccountGroupById(id, data) {
    return this.http.put(`${this.Api_Http}` + "/accountgroups/" + id, data, { headers: this.header })
  }

  // --------------Account type--------------

  createAccountTypeDetails(data) {
    return this.http.post(`${this.Api_Http}` + "/accounttypes", data, { headers: this.header })
  }
  getAccountTypeDetails() {
    return this.http.get(`${this.Api_Http}` + "/accounttypes", { headers: this.header })
  }
  deleteAccountTypeById(id) {
    return this.http.delete(`${this.Api_Http}` + "/accounttypes/" + id, { headers: this.header })
  }
  getAccountTypeById(id) {
    return this.http.get(`${this.Api_Http}` + "/accounttypes/" + id, { headers: this.header })
  }
  updateAccountTypeById(id, data) {
    return this.http.put(`${this.Api_Http}` + "/accounttypes/" + id, data, { headers: this.header })
  }
  // --------------BAnkDertails-----------------------
  createBankDetails(data) {
    return this.http.post(`${this.Api_Http}` + "/banks", data, { headers: this.header })
  }
  getBankDetails() {
    return this.http.get(`${this.Api_Http}` + "/banks", { headers: this.header })
  }
  deleteBankDetailsById(id) {
    return this.http.delete(`${this.Api_Http}` + "/banks/" + id, { headers: this.header });
  }
  getBankDetailsById(id) {
    return this.http.get(`${this.Api_Http}` + "/banks/" + id, { headers: this.header })
  }
  updateBankDetailsById(id, data) {
    return this.http.put(`${this.Api_Http}` + "/banks/" + id, data, { headers: this.header })
  }

  // -------------Bankwise details------------

  createBankWiseDetails(data) {
    return this.http.post(`${this.Api_Http}` + "/bwbankaccount", data, { headers: this.header })
  }
  getBankWiseDetails() {
    return this.http.get(`${this.Api_Http}` + "/bwbankaccount", { headers: this.header })
  }
  deleteBankWiseDetailsById(id) {
    return this.http.delete(`${this.Api_Http}` + "/bwbankaccount/" + id, { headers: this.header })
  }
  getBankWiseDetailsById(id) {
    return this.http.get(`${this.Api_Http}` + "/bwbankaccount/" + id, { headers: this.header })
  }
  updateBankWiseDetailsById(id, data) {
    return this.http.put(`${this.Api_Http}` + "/bwbankaccount/" + id, data, { headers: this.header })
  }

  // --------------------partytype--------------
  getpartytypeDetails() {
    return this.http.get(`${this.Api_Http}` + "/partytypelists", { headers: this.header })
  }

}
