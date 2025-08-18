import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective
  @ViewChild('myModals') public myModals: ModalDirective
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private service: UserService, private fb: FormBuilder, private tosatr: ToastrService) { }
  userrole: any;
  isCollapsed: boolean = false;
  listuservalue;
  rolePermissionList
  createUsers: FormGroup
  department_names;
  branch_names;
  getPermissions
  roledatas;
  update;
  sta;
  getRoles;
  save;
  validator;
  listRole;
  roleArray: FormArray = new FormArray([])
  roleArr;
  ngOnInit() {
    this.userrole = true;
    this.listUser();
    this.listpermissions();
    this.getDepartment();
    this.registerforms();
    this.getRoleData();
    this.getPermission();
    this.getRole();
  }
  usercreate;
  useredit
  userdelete
  listPermissionsData = []
  listpermissions(){
    this.service.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
     
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'user-create'){
          this.usercreate = true;
          
        }else if(this.listPermissionsData[j] == 'user-edit'){
          this.useredit = true;
        }else if(this.listPermissionsData[j] == 'user-delete'){
          this.userdelete = true;
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

  genders = [
    { gender: "Male" },
    { gender: "Female" }
  ]
  registerforms(): void {
    this.createUsers = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      employee_id: ['', [Validators.required]],
      mobile_number: ['', [Validators.required]],
      phone_number: [''],
      users_branch_id: ['', [Validators.required]],
      users_department_id: ['', [Validators.required]],
      cid: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      status: ['', [Validators.required]],
      permissions: this.fb.array([]),
      roles: this.fb.array([]),
      head_id: [''],
      remarks: ['', [Validators.required]],
    })
  }

  activeorInactive($event){
    const active = this.createUsers.get('status');
    if($event.target.checked == true) {
      active.patchValue(1)
    }else{
      active.patchValue(0)
    }
  
  }

  checkOnChangePermission(e): void {
    const permissions: FormArray = this.createUsers.get('permissions') as FormArray;
    // debugger;
    if (e.target.checked) {
      permissions.push(new FormControl(e.target.value));
    } else {
      const index = permissions.controls.findIndex(x => x.value === e.target.value);
      permissions.removeAt(index);

    }
  }
closed() {
  this.createUsers.reset();
  this.myModals.hide();
}
  checkOnChangeRole(e): void {
    const roles: FormArray = this.createUsers.get('roles') as FormArray;

    if (e.target.checked) {
      roles.push(new FormControl(e.target.value));
    } else {
      const index = roles.controls.findIndex(x => x.value === e.target.value);
      roles.removeAt(index);
    }
  }

  onCheckboxEditPermission(e,name) {
    const permissions: FormArray = this.createUsers.get('permissions') as FormArray;

    if (e.target.checked) {
      permissions.push(new FormControl(name));
    } else {

      const index = permissions.controls.findIndex(x => parseInt(x.value.permission_id) == name);

      permissions.removeAt(index);
    }
  }

  onCheckboxEditRoles(e,name) {
   
    const roles: FormArray = this.createUsers.get('roles') as FormArray;

    if (e.target.checked) {
      roles.push(new FormControl(name));
    } else {
      const index = roles.controls.findIndex(x =>parseInt(x.value.role_id) == name);

      roles.removeAt(index);
    }
  }

  shoewUserForm(): void {
    this.myModal.show()
    this.update = false;
    this.save = true;
    this.createUsers.reset(this.createUsers);
  }
  getpermissions: any;
  listUser() {
    this.isLoading = true;
    this.service.listuser().subscribe(res => {
      this.listuservalue = res['data'];
      this.isLoading = false;
      this.dtTrigger.next();
    }, error => {
      this.tosatr.error(error['statusText'] +" "+error.error.message);
      this.isLoading = false;
    })
  }

  getDepartment(): void {
    this.service.getDepartment().subscribe(res => {
      this.department_names = res['data'];
      this.getBranch();
    },error=>{
      this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }

  getBranch(): void {
    this.service.getBranchlist().subscribe(res => {
      this.branch_names = res['data']
    },error=>{
      this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }
  listOfRoleInArray = []
  listRoleData
  getRoleData(): void {
    this.service.getRole().subscribe(res => {
      this.roledatas = res;//debugger;
      this.listRoleData = res['data'];

      for (let i = 0; i < this.listRoleData.length; i++) {
        this.listOfRoleInArray[i] = this.listRoleData[i].name;
      }
    })
  }

  listOfPermissionInArray = [];
  getPermission(): void {
    this.service.listPermission().subscribe(res => {
      this.getPermissions = res['data']

      for (let i = 0; i <this.getPermissions.length; i++) {
        this.listOfPermissionInArray[i] = this.getPermissions [i].name;
      }
    })
  }
  submitted:any;
  createUser(): void {
    if(this.createUsers.invalid){
      this.submitted =false;
      return;
    }
    this.isLoading = true;
    this.service.insideCreateUser(this.createUsers.value).subscribe(res => {
      this.isLoading = false;
      this.myModal.hide();
      this.tosatr.success('Created Successfully!!!')
      this.listUser();
      this.createUsers.reset();
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }

  getRole(): void {
    this.service.getRole().subscribe(res => {
       console.log(res)
      this.listRole = res['data']
     
    },error=>{
      this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }
  getUser;
  checkedRole = [];
  checkroleToCheckInput = []
  listRoles;
  checkedpermission
  checkpermissionToCheckInput = []
  editUser(id): void {
   
    this.isLoading = true;
    this.service.editUser(id).subscribe(res => {
      this.getRoleData();
     console.log(res)
      this.getUser = res['user-data'];
      this.listRoles = res['user-role'];
      this.isLoading = false;
      this.sta = this.getUser['status']
      if (this.sta == "Active" || this.sta =='active') {
        this.validator = true;
      } else {
        this.validator = false;
      }
      this.myModals.show()
      this.createUsers = this.fb.group({
        id: [ this.getUser['id']],
        name: [ this.getUser['name']],
        dob: [ this.getUser['dob']],
        designation: [ this.getUser['designation']],
        employee_id: [ this.getUser['employee_id']],
        mobile_number: [ this.getUser['mobile_number']],
        phone_number: [ this.getUser['phone_number']],
        users_branch_id: [ this.getUser['users_branch_id']],
        users_department_id: [ this.getUser['users_department_id']],
        cid: [ this.getUser['cid']],
        gender: [ this.getUser['gender']],
        email: [ this.getUser['email']],
        password: [ this.getUser['password']],
        status: [this.validator],
          head_id: [this.getUser['head_id']],
          remarks: [''],

        permissions : this.fb.array( res['user-permissions'].map((datum) => this.generateDatumFormGrouppermission(datum))),

        roles: this.fb.array(
          res['user-role'].map((datum) => this.generateDatumFormGroup(datum))
        )

      })
     
        this.checkedpermission = this.createUsers.value.permissions;
      for (let i = 0; i <res['permission'].length; i++) {
        for (let j = 0; j < res['user-permissions'].length; j++) {
          if (parseInt(res['user-permissions'][j].id) === res['permission'][i].id) {
            this.checkpermissionToCheckInput[i] = res['permission'][i].id
            break;
          }
        }
      }
      this.checkedRole = this.createUsers.value.roles;
      for (let i = 0; i <res['roles'].length; i++) {
        for (let j = 0; j < res['user-role'].length; j++) {
          if (parseInt(res['user-role'][j].role_id) === res['roles'][i].id) {
            this.checkroleToCheckInput[i] = parseInt(res['roles'][i].id);
            break;
          }
        }
      }
 
    },error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  generateDatumFormGrouppermission(datum) {
      return this.fb.group({
        permission_id: this.fb.control({ value: datum['id'], disabled: false }),
  
      });
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      role_id: this.fb.control({ value: datum['role_id'], disabled: false }),
    });
  }

  updateUser() {
    this.isLoading = true;
   
    this.service.updateUserById(this.createUsers.value).subscribe(res => {
   
      if(res['0']=='success'){
        this.tosatr.success(res['message'].toString());
        this.createUsers.reset();
        this.myModals.hide();
      } else {
        this.tosatr.error(res['message']);
      }
      this.listUser();
      this.isLoading = false;
      this.createUsers.reset();
      this.myModals.hide();
      this.ngOnDestroy();
    }, error => {

      this.isLoading = false;

      this.tosatr.error(error['statusText'] + ' . ' + error.error.message);
      this.isLoading = false;
    });
  }

  deleteUser(id) {
    this.isLoading = true;
    this.service.deleteUser(id).subscribe(res => {
      this.listUser();
      this.isLoading = false;
      this.tosatr.success('Deleted Successfully!!!');
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] + ' ' + error.error.message);
    });
  }

  get registerFormControl() {
    return this.createUsers.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
