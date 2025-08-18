import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from 'rxjs';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal2') public myModal2: ModalDirective;
  dtOptions: any= {};
  subscription = new Subscription;
  dtTrigger: Subject<any> = new Subject<any>();

  permission;
  permissionArray = [];
  listroles;
  getAllpermissionBelongsToRoles;
  permissionValue;
  roleHasPermission;
  listPermission
  rolePermissionList
  uncheckPermissions: any[] = [];
  permissionList;
  number1;
  permissionsArr;
  createRole: FormGroup;
  editroles;
  number;
  checkedPermission;
  ischeck = [];
  id;
  ids
  es
  ischecked = [];
  editpermission;
  permissionsArray: FormArray = new FormArray([]);
  constructor(private tosatr: ToastrService, private fb: FormBuilder, private service: UserService, private route: Router) { }

  ngOnInit() {
    this.createRoless();
    this.listRole();
    this.getPermission();
  this.listpermissions();
  }
  rolecreate;
  roleedit
  roledelete
  permissiondelete
  listPermissionsData = []
  listpermissions(){
    this.service.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
     
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'user-create'){
          this.rolecreate = true;
          
        }else if(this.listPermissionsData[j] == 'role-edit'){
          this.roleedit = true;
        }else if(this.listPermissionsData[j] == 'role-delete'){
          this.roledelete = true;
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

  api = 'api'
  createRoless() {
    this.createRole = this.fb.group({
      role_id: [''],
      role_name: [''],
      guard_name: [this.api],
      permissions: this.fb.array([])
    })
  }
  get cities(): FormArray {
    return this.createRole.get('cities') as FormArray;
  }

  create() {
    this.myModal.show();
    this.getPermission()
    // this.createRole.reset();
  }

  onCheckboxChanged(e) {
    const permissions: FormArray = this.createRole.get('permissions') as FormArray;
    if (e.target.checked) {
      permissions.push(new FormControl(e.target.value));
    } else {
      const index = permissions.controls.findIndex(x => x.value === e.target.value);

      permissions.removeAt(index);
    }
  }

  onCheckboxEdit(e,name) {
    const permissions: FormArray = this.createRole.get('permissions') as FormArray;

    if (e.target.checked) {
      permissions.push(new FormControl(name));
    } else {

      const index = permissions.controls.findIndex(x => parseInt(x.value.permission_id) == name);
  
      permissions.removeAt(index);
    }
  }

  createRoles(): void {
   this.service.createRole(this.createRole.value).subscribe(res => {
      this.listRole();
      this.createRole.reset(this.createRole);
      this.tosatr.success('Created successfully')
      this.myModal.hide();
      this.ngOnDestroy();

    }, (error) => {
        this.tosatr.error(error['statusText'] +" "+error.error.message);
      this.myModal.hide();

    }
    );

  }

  listRole(): void {
    this.isLoading = true;
 this.service.getRole().subscribe(res => {
      this.listroles = res['data'];
      this.isLoading = false;
      this.dtTrigger.next();
      this.ngOnDestroy()

    },error=>{
        this.tosatr.error(error['statusText'] +" "+error.error.message);
      this.isLoading = false;
    })
  }
  show(id) {
    this.myModal2.show();
    this.ids = id
  }
  deleteRolesById(id): void {
    this.isLoading = true;
   this.service.deleteRoles(id).subscribe(res => {
      this.listRole();
      this.isLoading = false;
      this.tosatr.success('Deleted successfully!!!')
      this.myModal2.hide();
      this.ngOnDestroy()
    }, error => {
      this.isLoading = false; 
         this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }
  listOfPermissionInArray = []
  getPermission(): void {
    this.service.listPermission().subscribe(res => {
      this.permission = res['data'];
      for (let i = 0; i < this.permission.length; i++) {
        this.listOfPermissionInArray[i] = this.permission[i].name;
      }

    });
  }
  checked
  checkPermissionToCheckInput = []
  editRolesById(id): void {
    this.getPermission();
    // this.editPermissionByRoleId(id);

   this.service.editRole(id).subscribe(res => {
      this.myModals.show();

     
      this.editroles = res[0];
      this.createRole = this.fb.group({

        role_id: [this.editroles['id']],
        role_name: [this.editroles['name']],
        guard_name: [this.editroles['guard_name']],

        permissions: this.fb.array(

          res[2].map((datum) => this.generateDatumFormGroup(datum))
        ),
      })
      this.checked = this.createRole.value.permissions

      for (let i = 0; i <res[1].length; i++) {
        for (let j = 0; j < res[2].length; j++) {
          if (parseInt(res[2][j].permission_id) === res[1][i].id) {
            this.checkPermissionToCheckInput[i] = res[1][i].id
            break;
          }
        }
      
      }
    },error=>{
        this.tosatr.error(error['statusText'] +" "+error.error.message);
    })
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      permission_id: this.fb.control({ value: datum['permission_id'], disabled: false }),

    });

  }


  updateRole(): void {
    this.id = this.createRole.value.role_id;
  
    this.isLoading = true;
    this.service.updateRole(this.id, this.createRole.value).subscribe(res => {
      location.reload();
      this.ngOnDestroy();
      this.listRole();

      this.isLoading = false;
      this.createRole.reset(this.createRole);
      this.myModals.hide();
    },error=>{
        this.tosatr.error(error['statusText'] +" "+error.error.message);
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }
}
