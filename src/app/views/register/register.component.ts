import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../_service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal') public myModal: ModalDirective;
  forms: FormGroup;
  department_name: any;
  branch_name: any;
  showMessage;
  message;
  len;
  checkRegister;
  registerUser;
  checkCondition
  constructor(private fb: FormBuilder, private service: UserService, private tosatr: ToastrService,private router:Router) {

  }
  ngOnInit(): void {

    this.registerforms();
    this.getDepartment();
    this.getBranch();
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
  genders = [
    { gender: "Male" },
    { gender: "Female" }
  ]

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[@$!%*#?&])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }


  registerforms(): void {
    this.forms = this.fb.group({
      name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      designation: [''],
      employee_id: [''],
      mobile_number: ['', [Validators.required]],
      phone_number: [''],
      users_branch_id: [''],
      users_department_id: [''],
      cid: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(8),this.patternValidator()]],
      checkTermsCondition: ['',[Validators.required]]
    })
  }
  get registerFormControl() {
    return this.forms.controls;
  }
  submitted
  success
  registerAccount(): void {
  console.log(this.forms.value)
   if(this.forms.invalid || !this.forms.value.checkTermsCondition){
    this.forms.patchValue({
      checkTermsCondition: ''
    })
    this.submitted = true;
     return;
   }
    else {
      this.isLoading = true;
      console.log(this.forms.value)
      this.service.createuser(this.forms.value).subscribe(res => {
        this.tosatr.success('Created successfully. Please wait until admin activates your account');
         this.router.navigate(['./login'])
        this.success = true;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.tosatr.error(error.error.message)
      })
    }
  }


  getDepartment(): void {
    this.service.listDepartmentWithoutAuth().subscribe(res => {
      this.department_name = res['data'];
      console.log(res);
    })
  }
  getBranch(): void {
    this.service.listBranchWithoutAuth().subscribe(res => {
      this.branch_name = res['data'];
      console.log(res)
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
}
