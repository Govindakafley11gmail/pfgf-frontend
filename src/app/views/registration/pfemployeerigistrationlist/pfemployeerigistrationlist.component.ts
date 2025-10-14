import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { PfserviceService } from "../../_service/pf/pfservice.service";
import { PfemployeeService } from "../../_service/pfemployee/pfemployee.service";
import {Api} from '../../_service/api'
import { UserService } from "../../_service/user.service";
@Component({
  selector: "app-pfemployeerigistrationlist",
  templateUrl: "./pfemployeerigistrationlist.component.html",
  styleUrls: ["./pfemployeerigistrationlist.component.scss"],
})

export class PfemployeerigistrationlistComponent implements OnInit {
  @ViewChild("myModal") public myModal: ModalDirective;
  @ViewChild("myModals") public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  dtOptions: any = {};
  
  Api_Http = Api;

  pfemployeeDetail:any = [];
  ids;
  searchEmpFormGroup:FormGroup;
  pfEmployee: FormGroup;
  pfcompanyName;
  premiumData : any[] = [];
  paginateData: any[] = [];
  page = 1;
  pageSize = 4;
  collectionSize;
  min: any = 0;
  max: any = 0;
  findAllCompany:any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tosatr: ToastrService,
    private pfemployee: PfemployeeService,
    private pfcompany: PfserviceService,
    private httpclient:HttpClient,
    private userservice:UserService
  ) {}
  headers = new HttpHeaders({

    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
   ngOnInit() {
    this.listpermission();
  this.getPFEmployeeDetails();
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   lengthMenu: [10, 50, 100, 1000, 10000],
    //   processing: true,
    // };


   this.searchEmpFormGroup =  new FormGroup({
      employee_name : new FormControl('')
    })

  }
   async fetchCompanyDetails() {
    this.isLoading = true;
    await this.pfcompany.findAllCompany().subscribe(res => {
      this.isLoading = false;
      console.log('company',res)
      // if(res['success']){
        this.findAllCompany = res;
      // }
      this.dtTrigger.next();
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  createEmployee;
  employeeEdit;
  employeeDelete
  listPermission = []
  listpermission(){
    this.userservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'employee-create'){
          console.log(this.listPermission[j])
          this.createEmployee = true;
          
        }else if(this.listPermission[j] == 'employee-edit'){
          this.employeeEdit = true;
        }else if(this.listPermission[j] == 'employee-delete') {
          this.employeeDelete = true;
        }
      }
    })
  }
  employ_name
  getEmployeeDataBySearchFilter(emp_name) {
     this.employ_name  ;
     if(typeof(emp_name) === 'string'){
       console.log(typeof(emp_name))
       let row3 = this.searchEmpFormGroup.get('employee_name');
       row3.patchValue(emp_name);
     }else{
        this.page = emp_name
     }

    if(this.searchEmpFormGroup.value.employee_name != ''){
       this.httpclient.get<any>(`${this.Api_Http}/get-employee-list-by-search-filter/${this.searchEmpFormGroup.value.employee_name}?pages=${this.page}`, { headers: this.headers }).subscribe(res=>{
      console.log(res)
      this.pfemployeeDetail = res['data'];
      this.collectionSize = res['total'];
      this.dtTrigger.next();
    })
    }else{
      this.httpclient.get<any>(`${this.Api_Http}/pfemployees?pages=${emp_name}`, { headers: this.headers }).subscribe(res=>{
        console.log(res)
        this.pfemployeeDetail = res['data'];
        this.collectionSize = res['total'];
        this.dtTrigger.next();
        // this.ngOnDestroy();
      })
    }
    console.log(this.searchEmpFormGroup.value)
    
  }
 

  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
  start() {
    this.isLoading = true;
    this.wait(2000).then(() => (this.isLoading = false));
  }
  totalcontribution = [];
  async getPFEmployeeDetails() {
    this.isLoading = true;
    await this.pfemployee.getPfEmployeeDetails().subscribe(
      (res) => {
        console.log(res)
        this.isLoading = false;
        this.pfemployeeDetail = res['data'];
        // this.collectionSize = res['data']['total'];
        for (let i = 0; i < this.pfemployeeDetail.length; i++) {
          this.totalcontribution[i] =
            parseInt(this.pfemployeeDetail[i].employee_contribution_amount) +
            parseInt(this.pfemployeeDetail[i].employer_contribution_amount);
        }
        this.dtTrigger.next();
        this.ngOnDestroy();
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }
  getPfEmployeeById(id) {
    this.router.navigate(["./registration/pfemployeeregistration", id]);
  }
  clearForm() {
    this.pfEmployee.reset({
      company_pf_acc_no: "",
      pf_employee_company_id: "",
      employee_name: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      nationality: "",
      identification_types: "",
      identification_no: "",
      designation: "",
      department: "",
      employee_id_no: "",
      service_joining_date: "",
      contact_no: "",
      email_id: "",
      address: "",
      basic_pay: "",
      contribution: "",
      employee_contribution_amount: "",
      employer_contribution_amount: "",
      status: "",
      registration_date: "",
    });
  }
  closepopup() {
    this.myModals.hide();
    this.clearForm();
  }

  show(id) {
    this.ids = id;
    this.myModals.show();
  }
  async deletePfEmployeeDetailsById(id) {
    this.isLoading = true;
    await this.pfemployee.deletePfEmployeeDetailsById(id).subscribe(
      (res) => {
        this.isLoading = false;
        this.getPFEmployeeDetails();
        this.tosatr.success("Deleted successfully!!!");
        this.myModals.hide();

        console.log(res);
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }
  get registerFormControl() {
    return this.pfEmployee.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
