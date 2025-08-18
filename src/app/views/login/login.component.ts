import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomValidators } from './CustomValidators.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from '../_service/user.service';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { TokenService } from '../_service/tokenServices';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  subscription: Subscription
  form: FormGroup;
  equation: FormGroup;
  lignCrenditial: any;
  loginCredential;
  ListParticulatUser;
  number;
  subscriptions;
  message;
  indexing;
  isLogin
  len;
  loginChecker;
  logins;

  solveequation;
  randomvalue;
  randomvaluecel;
  erroecalculation
  loginSpinner
  isLoading
  forgotPasswordFormGroup: FormGroup;
  isExpired: boolean;
  constructor(private tosatr: ToastrService, private http: HttpClient, private fb: FormBuilder, private service: UserService, private router: Router,  private tokenService: TokenService) { }

  ngOnInit() {
    this.formData();
    this.logins = true;
    this.isLoading = false;
    this.forgotPasswordFormControl();
  }
  forgotPasswordFormControl() {
    this.forgotPasswordFormGroup = new FormGroup({
      user_email: new FormControl('', [Validators.required]),
       cid: new FormControl('', [Validators.required]),
    },
    )
  }

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
  passwordConfirmation(){
    this.forgotPasswordFormGroup = new FormGroup({
      password: new FormControl('', [Validators.required, this.patternValidator()]),
      confirm_password: new FormControl('', [Validators.required]),
      user_otp: new FormControl('')
    },
    CustomValidators.mustMatch('password', 'confirm_password') 
    )
  }
  verifyOTPFormControl() {
    this.forgotPasswordFormGroup = new FormGroup({
      user_otp: new FormControl('', [Validators.required, Validators.minLength(4),Validators.maxLength(4)])
    },
    )
  }

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
  async formData() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  submitted;
  token
  async login() {
    this.submitted = true
    if (this.form.invalid) {
      return;
    }
    if (this.form.valid) {
      this.isLoading = true;
      console.log(this.form.value)
      const token = localStorage.getItem('access_token');
      this.isExpired = this.tokenService.isTokenExpired(token);
      if(this.isExpired){
        await this.service.postLoginData(this.form.value).subscribe((res) => {
          this.isLoading = false;
          console.log(res)
          if (res['success']==false) {

            this.message = res.message;
            this.tosatr.error(this.message);
            return;
          }
         if (res['success']===true &&  res['token'] != null && res['user-data'].status === 'Active' && res['user-data'].password_status  === 'isChanged') {
            // this.loginSpinner = false;
            // document.cookie = `token=${res['token']}`;
            this.token = res['token'];
            localStorage.setItem('access_token', res['token']);
            localStorage.setItem('userName', res['user-data'].name);
            localStorage.setItem('mobile_number', res['user-data'].mobile_number);
            localStorage.setItem('employee_id', res['user-data'].employee_id);
            localStorage.setItem('designation', res['user-data'].designation);
            localStorage.setItem('id',res['user-data'].id)
            this.tosatr.success('Login Successful!!!');
            localStorage.setItem('foo','no reload');
            this.myModals.show();
          }
          else {
  
            this.message = 'This user account has already been logged into another device!!!'
            this.tosatr.warning('This user account has already been logged into another device!!!')
          }
        }, (error) => {
          console.log("error=>",error)
          this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
        })
      }else {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      }
  

    }
    else {
      this.tosatr.warning('Login Failed!!!')
      this.router.navigate(['login'])
    }

  }
  loginToDashboard(){
    this.tosatr.success('Login Successful!!!');
    this.router.navigate(['/dashboard']);
 }
 clanceLogin(token) {
 
  this.service.logoutLogin(token).subscribe(response => {
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
    this.myModals.hide();
   
  }, error => {
  console.log(error)
  })
 }
  forgotPassword() {
    this.myModal.show();
    this.emailandpass = true; 
    this.password = false;
    this.Verification = false;
    this.forgotPasswordFormControl();
  }
  emailandpass
  Verification
  time
  index;
  changeUserPassword() {
   
    if (this.forgotPasswordFormGroup.invalid) {
      this.submitted = true;
      return;
    } else {
 
      this.isLoading = true;
      this.service.ChangeUserPassword(this.forgotPasswordFormGroup.value).subscribe((res) => {
     
        this.verifyOTPFormControl();
        this.isLoading = false;
        if(res['status']==='success'){
          this.index =0;
          this.tosatr.success(res['message'])  
          this.emailandpass = false; 
          this.Verification = true;
          this.password = false;
        this.time = setInterval(() => {
        this.index += 1;
        if(this.index == 3600){
          this.emailandpass = true; 
          this.Verification = false;
          this.ngOnDestroy();
        }
        }, 1000);
         
        }else{
          this.forgotPasswordFormControl()
          this.tosatr.error(res['message']) 
          this.emailandpass = true; 
          this.Verification = false; 
        }
      }, error => {
      
        this.forgotPasswordFormControl();
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }
  }
  password
  verifyOTP() {
   
    this.service.ChangeUserOTP(this.forgotPasswordFormGroup.value).subscribe(res => {
     
      this.isLoading = false;
      if(res['status']=='success'){
        this.passwordConfirmation();
        this.tosatr.success(res['message'])  
        let row3 = this.forgotPasswordFormGroup.get('user_otp');
        row3.patchValue(res['OTP']);
        this.emailandpass = false; 
        this.Verification = false;
          this.password = true;
         
      }else{
        this.tosatr.error(res['message']) 
        this.emailandpass = false; 
        this.Verification = true; 
        this.password = false;
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  submitToChangePassword() {
    this.service.submitToChangePassword(this.forgotPasswordFormGroup.value).subscribe(res => {
      this.isLoading = false;
      if(res['status']=='success'){
        this.tosatr.success(res['message'])  
        this.emailandpass = false; 
        this.Verification = false;
          this.password = true;
          this.myModal.hide();
      }else{
        this.tosatr.error(res['message']) 
        this.emailandpass = true; 
        this.password = false;
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  get registerFormControl() {
    return this.form.controls;
  }
  get registerFormControl1() {
    return this.forgotPasswordFormGroup.controls;
  }
ngOnDestroy():void {
  if (this.time) {
    clearInterval(this.time);
  }
}
  // --------------forgetpassword---------------
}
