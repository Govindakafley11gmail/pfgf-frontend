import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../_service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  createUsers: FormGroup;
  branchlist;
  departmentlist
  constructor(private service: UserService,private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.getUserByCid();
    this.getUserBranch();
    this.getUserDepartment();
      this.createUsers = this.fb.group({
        id: new FormControl(''),
        name: new FormControl(''),
        dob: new FormControl(''),
        designation: new FormControl(''),
        employee_id: new FormControl(''),
        mobile_number: new FormControl(''),
        phone_number: new FormControl(''),
        users_branch_id: new FormControl(''),
        users_department_id: new FormControl(''),
        cid: new FormControl(''),
        gender: new FormControl(''),
        email: new FormControl(''),
        status: new FormControl(''),
        file_name: new FormControl(''),
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
  getUserByCid() {
    this.isLoading = true;
    this.service.editUser(localStorage.getItem('id')).subscribe(res=>{
      this.isLoading = false;
      this.createUsers = this.fb.group({
        id: new FormControl(res['user-data']['id']),
        name: new FormControl(res['user-data']['name']),
        dob: new FormControl(res['user-data']['dob']),
        designation: new FormControl(res['user-data']['designation']),
        employee_id: new FormControl(res['user-data']['employee_id']),
        mobile_number: new FormControl(res['user-data']['mobile_number']),
        phone_number: new FormControl(res['user-data']['phone_number']),
        users_branch_id: new FormControl(res['user-data']['users_branch_id']),
        users_department_id: new FormControl(res['user-data']['users_department_id']),
        cid: new FormControl(res['user-data']['cid']),
        gender: new FormControl(res['user-data']['gender']),
        email: new FormControl(res['user-data']['email']),
        status: new FormControl(res['user-data']['status']),
        permissions : this.fb.array( res['user-permissions'].map((datum) => this.generateDatumFormGrouppermission(datum))),
        file_name: new FormControl(res['user-data']['file_name']),
        roles: this.fb.array(
          res['user-role'].map((datum) => this.generateDatumFormGroup(datum))
        )
    },error=>{
      this.isLoading = false;
    })
   })
  }

  generateDatumFormGrouppermission(datum) {
    return this.fb.group({
      permission_id: this.fb.control({ value: datum['id'], disabled: false }),

    });
}
onFileSelected(event) {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    this.createUsers.patchValue({
      file_name: file
    });
  }
}

private generateDatumFormGroup(datum) {
  return this.fb.group({
    role_id: this.fb.control({ value: datum['role_id'], disabled: false }),
  });
}
  getUserBranch() {
    this.service.getBranchlist().subscribe(res=>{
      this.branchlist = res;
    })
  }
  getUserDepartment() {
    this.service.listDepartname().subscribe(res=>{
      this.departmentlist = res;
    })
  }

  genders = [
    { gender: "Male" },
    { gender: "Female" }
  ]
 updateUserProfile(): void {
    this.isLoading = true;

    const formData = new FormData();

    // Append all fields
    Object.keys(this.createUsers.controls).forEach(key => {
      const control = this.createUsers.get(key);

      if (key === 'file_name') {
        const file = control?.value;
        if (file && file instanceof File) {
          formData.append('file_name', file);
        }
      } else if (key === 'permissions' || key === 'roles') {
        formData.append(key, JSON.stringify(control?.value));
      } else {
        formData.append(key, control?.value ?? '');
      }
    });

    this.service.updateUserById(formData).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  startLoading(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }
}


