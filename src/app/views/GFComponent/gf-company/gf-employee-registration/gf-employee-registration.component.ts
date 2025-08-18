import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CompanyService } from '../../../_service/GF-API/company.service';
import { EmployeeService } from '../../../_service/GF-API/employee.service';

@Component({
  selector: 'app-gf-employee-registration',
  templateUrl: './gf-employee-registration.component.html',
  styleUrls: ['./gf-employee-registration.component.scss']
})
export class GfEmployeeRegistrationComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  pfEmployee: FormGroup;
  pfemployeeDetail;
  ids;
  depatment;
  org_Id;
  contributions: any;
  totalcontribution
  contributions1
  contributions2
  totalcontribution2
  basic_pay: any;
  cont_rate: any;
  EmployeeContributionAmt;
  EmployeeContributionAmt1;
  EmployeeContributionAmt2;
  EmployeeTotalContributionAmt;
  identification_type;
  pfaccno;
  sid;
  isDisabled
  save;
  edit;
  cancel;
  update;
  dropdownDisable;
  dropdownEnable;
  number;
  pfaccCompanyId
  companyid;
  getitByCompanyId = ""
  EmployerContributionAmt
  lampsum;
  companyacno;
  status
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private tosatr: ToastrService, private pfemployee: EmployeeService, private pfservice: CompanyService) { 
    this.getPfEmoloyeeAccNo();
  }


  ngOnInit(): void {
    this.status = false;
    this.lampsum = true
    this.pfemployeeFormcontrol()
    this.identificationType();
    if (!this.route.snapshot.params['id']) {
      this.save = true;
      this.edit = false;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = false;
      this.dropdownEnable = true;

    } else {
      this.getPfEmployeeById();
    }
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
  gender = [
    { gender: 'Male' },
    { gender: 'Female' }
  ]
  calculation1() {
    this.EmployeeContributionAmt1 = this.pfEmployee.value.basic_pay;
    this.EmployeeContributionAmt2 = this.pfEmployee.value.contribution;
    this.EmployeeContributionAmt = 0;
      this.EmployerContributionAmt = this.EmployeeContributionAmt1 * this.EmployeeContributionAmt2 / 100;
    this.EmployeeTotalContributionAmt = this.EmployeeContributionAmt;

  }
  statuss = [
    { status: 'Active' },
    { status: 'Closed' },
    { status: 'Pending' },
  ]

  pfemployeeFormcontrol() {
    this.pfEmployee = this.fb.group({
      pf_employee_id: [''],
      pf_employee_company_id: ['', [Validators.required]],
      company_pf_acc_no: ['', [Validators.required]],
      employee_name: [''],
      date_of_birth: [''],
      gender: [''],
      marital_status: [''],
      nationality: [''],
      identification_types: [''],
      identification_no: [''],
      designation: [''],
      department: [''],
      service_joining_date: [''],
      contact_no: [''],
      email_id: [''],
      address: ['', [Validators.required]],
      basic_pay: [''],
      contribution: [''],
      employee_contribution_amount: [''],
      employer_contribution_amount: [''],
      status: ['Active', [Validators.required]],
      registration_date: [''],
      total_contribution: [''],
      pf_emp_acc_no: ['']
    })
  }
 async getcompanyId() {
    this.companyacno = true;
   await this.pfservice.editPfCompaneyById(this.pfEmployee.value.pf_employee_company_id).subscribe(res => {
      this.pfEmployee.get("company_pf_acc_no").patchValue(res['Data'][0].company_account_no);
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  marital_status = [
    { maritalstatus: 'Single' },
    { maritalstatus: 'Married' },
  ]
  nationalitys = [
    { nationality: 'Bhutanese' },
    { nationality: 'Non-Bhutanese' },
  ]
 async getPfEmoloyeeAccNo() {
  await  this.pfservice.PFcompaneyRegistrationList().subscribe(res => {
      if(res['success']){
        this.pfaccno = res['data'];
      }
    

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  editPfEmployeeById() {
    if (this.pfEmployee.value.status != 'Closed') {
      this.isDisabled = false;
      this.save = false;
      this.edit = false;;
      this.cancel = true;
      this.update = true;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
    } else {
      this.tosatr.warning('Cannot Update Employee. Due to Status is closed')
      this.isDisabled = true;
      this.save = false;
      this.edit = true;;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
    }

  }

  cancelPfEmployeeById() {
    this.isDisabled = true;
    this.save = false;
    this.edit = true;;
    this.cancel = false;
    this.update = false;
    this.dropdownDisable = true;
    this.dropdownEnable = false;
  }
async  getPfEmployeeById() {
    this.isLoading = true;
    this.isDisabled = true;
    this.save = false;
    this.edit = true;
    this.cancel = false;
    this.update = false;
    this.dropdownDisable = true;
  await  this.pfemployee.getPfEmployeeById(this.route.snapshot.params['id']).subscribe(res => {
      this.isLoading = false;
      this.status = true;
      this.companyacno = true;
      this.pfEmployee = this.fb.group({
        id: [res[0]['id']],
        pf_employee_id: [res[0]['pf_employee_id']],
        company_pf_acc_no: [res[0]['company_pf_acc_no'], [Validators.required]],
        pf_employee_company_id: [res[0]['pf_employee_company_id'], [Validators.required]],
        employee_name: [res[0]['employee_name']],
        date_of_birth: [res[0]['date_of_birth']],
        gender: [res[0]['gender']],
        marital_status: [res[0]['marital_status']],
        nationality: [res[0]['nationality']],
        identification_types: [res[0]['identification_types']],
        identification_no: [res[0]['identification_no']],
        designation: [res[0]['designation']],
        department: [res[0]['department']],
        service_joining_date: [res[0]['service_joining_date']],
        contact_no: [res[0]['contact_no']],
        email_id: [res[0]['email_id']],
        address: [res[0]['address']],
        basic_pay: [res[0]['basic_pay']],
        contribution: [res[0]['contribution']],
        employee_contribution_amount: [res[0]['employee_contribution_amount']],
        employer_contribution_amount: [res[0]['employer_contribution_amount']],
        status: [res[0]['status']],
        registration_date: [res[0]['registration_date']],
        total_contribution: [res[0]['total_contribution']],
        pf_emp_acc_no: [res[0]['pf_emp_acc_no']]
      })
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  submitted
  createPfEmployeeDetails() {
    if (this.pfEmployee.invalid) {
      this.submitted = true;
      return;
    }
    else  {
      this.isLoading = true;
      this.pfemployee.createPfEmployeeDetails(this.pfEmployee.value).subscribe(res => {
        this.pfEmployee.reset(this.pfEmployee);
        this.isLoading = false;
        this.tosatr.success('Created successfully!!!')
        this.router.navigate(['/registration/employee-registration', res])

      }, error => {
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false
      })
    }
  }

  identificationType() {
    this.isLoading = true;
    this.pfemployee.identificationType().subscribe(res => {
      this.isLoading = false;
      this.identification_type = res;
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  updataPfEmployeeById() {
    this.isLoading = true;
    this.pfemployee.updataPfEmployeeById(this.pfEmployee.value.id, this.pfEmployee.value).subscribe(res => {
      this.status = true;
      this.edit = true;
      this.isLoading = false;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
      this.isDisabled = true;
      this.tosatr.success('Updated successfully!!!');

      this.ngOnDestroy();

    }, (error) => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.myModal.show();
  }
  get registerFormControl() {
    return this.pfEmployee.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
