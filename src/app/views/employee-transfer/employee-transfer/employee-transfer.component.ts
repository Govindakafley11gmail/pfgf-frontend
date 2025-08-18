import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../_service/GF-API/company.service';
import { EmployeeService } from '../../_service/GF-API/employee.service';
import { PfserviceService } from '../../_service/pf/pfservice.service';
import { PfemployeeService } from '../../_service/pfemployee/pfemployee.service';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrls: ['./employee-transfer.component.scss']
})
export class EmployeeTransferComponent implements OnInit {
  employeeTransfer:FormGroup;
  companyName;
  employeeName;
  isDissabled = true;
  org_name : String;
  emp_name : String;
  trans_name : String;
  constructor(private gfemployee:EmployeeService,private pfemployee:PfemployeeService,private tosatr: ToastrService, private fb: FormBuilder,private gfcompanyDetails: CompanyService, private pfservice: PfserviceService,private userService:UserService) { }

  ngOnInit(): void {
    this.employeeTransferFormControl();
    this. listpermissions()
  }

  listPermissionsData = []
  employeeTransfers;
  listpermissions(){
    this.userService.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'employee-transfer'){
          this.employeeTransfers = true;
          this.isDissabled = false;
        }
        
      }
    })
  }

  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  start() {
    this.isLoading = true;
    this.wait(2000).then(() => this.isLoading = false);
  }
  employeeTransferFormControl(){
    this.employeeTransfer = this.fb.group({
      registration_type: new FormControl(''),
      company_id: new FormControl(''),
      employee_id : new FormControl(''),
      identification_no: new FormControl(''),
      transfer_company_id: new FormControl(''),
      transfer_date: new FormControl(''),
    })
  }

  refundType = [
    { refundtype: 'PF Refund', value: 'PF' },
    { refundtype: 'GF Refund', value: 'GF' }
  ]
  

  changeRefundType() {
    console.log(this.employeeTransfer.value.registration_type)
    if (this.employeeTransfer.value.registration_type == 'PF') {
      this.getPFCompany();
    } else {
      this.getGFCompany()
    }
  }


  async getPFCompany() {
    this.isLoading = true;
    await this.pfservice.PFcompaneyRegistrationList().subscribe(res => {
      console.log(res)
      this.isLoading = false;
      if(res['success']) {
        this.companyName = res['data'];
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  async getGFCompany() {
    this.isLoading = true;
    await this.gfcompanyDetails.PFcompaneyRegistrationList().subscribe(res => {
      this.isLoading = false;
      if(res['success']){
         this.companyName = res['data'];
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  async changeOrgById() {
    if (this.employeeTransfer.value.registration_type == 'PF') {
      this.isLoading = true;
      await this.pfservice.getByEmployeeName(this.employeeTransfer.value.company_id).subscribe(res => {
        this.isLoading = false;
        if (res.length > 0) {
          this.employeeName = res[0].get_employee_details
        }
        console.log(res)
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    } else {
      this.isLoading = true;
      await this.gfcompanyDetails.getByEmployeeName(this.employeeTransfer.value.company_id).subscribe(res => {
        this.isLoading = false;
        console.log(res)
        if (res.length > 0) {
          this.employeeName = res[0].get_employee_details
        }
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }
  }

  changeEmployeeName() {
    if (this.employeeTransfer.value.registration_type == 'PF') {

      this.pfemployee.getPfEmployeeById(this.employeeTransfer.value.employee_id).subscribe(res => {
        console.log(res)
        this.employeeTransfer.get("identification_no").setValue(res[0]['identification_no']);
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      })
    } else {
      this.gfemployee.getPfEmployeeById(this.employeeTransfer.value.employee_id).subscribe(res => {
        console.log(res)
        this.employeeTransfer.get("identification_no").setValue(res[0]['identification_no']);
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      })
    }
  }
  submitted;
 async transferEmployee(){
    this.isLoading = true;
    if(this.employeeTransfer.invalid){
      this.submitted = true;
      return;
    }else{
      await this.pfservice.transferEmployeeToAnotherExtension(this.employeeTransfer.value).subscribe(res => {
        this.isLoading = false;
        if(res[0]=='success'){
          this.isDissabled = true;
          this.submitted = false;
          this.tosatr.success(res['message']);
        }else{
          this.isDissabled = false;
          this.tosatr.error(res['message']);
        }     
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isDissabled = false;
        this.isLoading = false;
      })
    }
   
  }
  reset(){
    this.employeeTransfer.reset();
    this.isDissabled = false;
  }
  get registerFormControl() {
    return this.employeeTransfer.controls;
  }
}
