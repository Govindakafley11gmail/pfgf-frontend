import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal2') public myModal2: ModalDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  permission;
  permissionArray = [];
  listroles;
  permissions=[];
  permissionValue;
  roleHasPermission;
  listPermission
  rolePermissionList
  uncheckPermissions: any = [];
  permissionList;
  number1;
  permissionsArr;
  createRole: FormGroup;
  editroles;
  number;
  checkedPermission;

  id;
  ids
  editpermission;
  permissionsArray: FormArray = new FormArray([]);
  constructor(private tosatr: ToastrService, private fb: FormBuilder, private service: UserService, private route: Router) { }

  ngOnInit() {
    this.createRoless();
    this.listRole();
    this.getPermission();
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

  create() {
    this.myModal.show();
    // this.createRole.reset();
  }


    // getPermissions(role: Role): void {
    //   this.permissions = [];
    //   this.userService.getPermissions().then(perms => {
    //       if (role != null) {
    //           this.permissions = perms;
    //           for (let rp of role.permissions) {
    //               let index = this.permissions.indexOf(this.permissions.find(p => p.permission_id == rp.permission_id));
    //               if (index >= 0) {
    //                    this.permissions = this.permissions.slice(0) // copy the array.
    //                    this.permissions[index].checked = true;
    //                   //this.onSelectFilter(true, this.permissions[index]); not sure if this should be called
    //               }
    //           }
    //           console.log("before selected perms on update");
    //           console.log(this.permissions);
    //       }
    //       else {
    //           this.permissions = perms;
    //       }

    //   }).catch(this.handleError);
    //   }

    //      onSelectFilter(selected: boolean, filter: Permission) {
    //       filter.checked = selected;
    //       if (this.permissions.every(filter => !filter.checked)) {
    //           setTimeout(() => {
    //               this.permissions = this.permissions.slice(0) // copy the array.
    //               this.permissions.forEach(filter => filter.checked = true);
    //           });
    //       }
    //   }




  createRoles(): void {
    console.log(this.createRole.value)
    this.service.createRole(this.createRole.value).subscribe(res => {
      this.listRole();
      this.tosatr.success('Created successfully')
      this.myModal.hide();
      this.ngOnDestroy();

    }, (error) => {
      console.log(error)
      this.tosatr.error('have some Issues!!')
      this.myModal.hide();

    }
    );

  }

  listRole(): void {
    this.service.getRole().subscribe(res => {
      this.listroles = res['data'];
      console.log(res)
      this.dtTrigger.next();
      this.ngOnDestroy()
    }, error => {
      console.log(error)
      this.tosatr.error('User does not have the right permissions !!!')
    })
  }
  show(id) {
    this.myModal2.show();
    this.ids = id
  }
  deleteRolesById(id): void {
    this.service.deleteRoles(id).subscribe(res => {
      this.listRole();
      this.tosatr.success('Deleted successfully!!!')
      this.myModal2.hide();
      this.ngOnDestroy()
    }, error => {
      this.tosatr.success('Failed to Delete!!!')
    })
  }
  getPermission(): void {
    this.service.listPermission().subscribe(res => {
      this.permission = res;

    });
  }

  editRolesById(id): void {

    this.service.editRole(id).subscribe(res => {
      this.myModals.show();
      console.log(res)
      this.editroles = res[0]
      // console.log(res)
      this.permissionList = res[1]
      this.createRole = this.fb.group({
        role_id: [this.editroles['id']],
        role_name: [this.editroles['name']],
        guard_name: [this.editroles['guard_name']],
        permissions: this.fb.array([])
      })
      this.editPermissionByRoleId(id);
    })
  }

  editPermissionByRoleId(id): void {
    this.service.fetchPermissionByRoleId(id).subscribe((res: Array<any>) => {
      this.rolePermissionList = res;
      res.forEach(element => {
        this.permissionsArray.push(this.fb.control(element['name']));
      });
      this.pushPermissionToArray();
      // console.log(this.permissionsArray)
    });
  }

  pushPermissionToArray(): void {
    // const index = this.permissionValue.index(this.permissionsArray['value'])
    // console.log(index)
    this.permissionsArr = this.permissionsArray['value'];
    console.log(this.permissionsArr);
  }

  updateRole(): void {
    this.id = this.createRole.value.role_id;
    console.log(this.createRole.value)

    this.service.updateRole(this.id, this.createRole.value).subscribe(res => {

      this.listRole();
      this.myModal.hide();
      console.log(res)
      this.ngOnDestroy();
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

