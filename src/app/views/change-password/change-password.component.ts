import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { UserService } from "../_service/user.service";
import { CustomValidators } from '../login/CustomValidators.component';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePassword: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService,private router:Router,private tosatr: ToastrService) {}

  ngOnInit(): void {
    this.changePassword = this.fb.group({
      id: new FormControl(parseInt(localStorage.getItem('id'))),
      password: new FormControl("",[Validators.required,this.patternValidator()]),
      confirm_password: new FormControl("",[Validators.required]),
    }, CustomValidators.mustMatch('password', 'confirm_password') 

    );
  }
  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
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
  
  start() { 
    this.isLoading = true;
    this.wait(2000).then(() => this.isLoading = false);
  }
  submitted
  changeUserPassword() {
    console.log(this.changePassword.value);
    if(this.changePassword.invalid){
      this.submitted = true
      return;
    }else{
      this.isLoading = true;
      this.userService
        .UpdatePassword(this.changePassword.value)
        .subscribe((res) => {
          console.log(res)
          this.isLoading = false;
          if(res['status']==='success') {
            this.tosatr.success(res['message']);
            this.router.navigate(['./dashboard'])
          }else{
            this.tosatr.error(res['message']);
          }
        },error=>{debugger;
          this.isLoading = false;
        });
    }
   
  }
  get registerFormControl() {
    return this.changePassword.controls;
  }
}
