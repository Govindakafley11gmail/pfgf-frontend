import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {CompanyService} from '../../../_service/GF-API/company.service';
import {EmployeeService} from '../../../_service/GF-API/employee.service';
import { UserService } from '../../../_service/user.service';

@Component({
  selector: 'app-gf-employee-list',
  templateUrl: './gf-employee-list.component.html',
  styleUrls: ['./gf-employee-list.component.scss']
})
export class GfEmployeeListComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  pfemployeeDetail
  ids;
  pfEmployee: FormGroup
  pfcompanyName
  constructor(private userservice:UserService,private router: Router, private fb: FormBuilder, private tosatr: ToastrService, private gfemployeeservice:EmployeeService, private gfcompanyservice:CompanyService ) { }

  ngOnInit() {
  this.getPFEmployeeDetails();
  this.listpermission();

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
  isLoading = false;

  load() : void {
    this.isLoading = true;
    setTimeout( () => this.isLoading = false, 2000 );
  }

	async wait(ms: number): Promise<void> {
		return new Promise<void>( resolve => setTimeout( resolve, ms) );
	}

	start() {
    this.isLoading = true;
		this.wait(2000).then( () => this.isLoading = false );
	}

  totalcontribution = []

  async getPFEmployeeDetails() {
    this.isLoading = true;
    await this.gfemployeeservice.getPfEmployeeDetails().subscribe(res => {
      this.isLoading = false;
      if(res['success']){
        this.pfemployeeDetail = res['data'];
        for(let i=0;i< this.pfemployeeDetail.length;i++) {
          this.totalcontribution[i] = parseInt(this.pfemployeeDetail[i].employee_contribution_amount)+parseInt(this.pfemployeeDetail[i].employer_contribution_amount)
        }
      }
      this.dtTrigger.next();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  getPfEmployeeById(id) {
    this.router.navigate(['./registration/employee-registration', id])
  }
  clearForm() {
    this.pfEmployee.reset({
      'company_pf_acc_no': '',
      'pf_employee_company_id': '',
      'employee_name': '',
      'date_of_birth': '',
      'gender': '',
      'marital_status': '',
      'nationality': '',
      'identification_types': '',
      'identification_no': '',
      'designation': '',
      'department': '',
      'employee_id_no': '',
      'service_joining_date': '',
      'contact_no': '',
      'email_id': '',
      'address': '',
      'basic_pay': '',
      'contribution': '',
      'employee_contribution_amount': '',
      'employer_contribution_amount': '',
      'status': '',
      'registration_date': '',
    });
  }
  closepopup() {
    this.myModals.hide();
    this.clearForm()
  }

  show(id) {
    this.ids = id
    this.myModals.show();
  }
  async deletePfEmployeeDetailsById(id) {
    this.isLoading = true;
    await this.gfemployeeservice.deletePfEmployeeDetailsById(id).subscribe(res => {
      this.isLoading = false;
      this.getPFEmployeeDetails();
      this.tosatr.success('Deleted successfully!!!')
      this.myModals.hide();

      console.log(res)
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    
    })
  }
  get registerFormControl() {
    return this.pfEmployee.controls;
  }

}
