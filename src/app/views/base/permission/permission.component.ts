import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../_service/user.service';
import { Subject, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface PermissionResponse {
  data: Permission[];
}

interface UserPermissionResponse {
  'user-permissions-list': { name: string }[];
}

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit, OnDestroy {
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
dtOptions: any = {}; // Now Angular will recognize it

  private subscriptions = new Subscription();
  dataSource: MatTableDataSource<Permission> = new MatTableDataSource<Permission>([]);
    dtTrigger: Subject<any> = new Subject<any>();
  displayedColumns: string[] = ['id', 'name', 'guard_name', 'actions'];
  createPermission: FormGroup;
  listPermissions: Permission[] = [];
  listPermissionsDatas: string[] = [];
  permissioncreate = false;
  permissionedit = false;
  permissiondelete = false;
  isLoading = false;
  submitted = false;
  update = false;
  save = true;
  currentId: number | null = null;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private service: UserService,
    private router: Router
  ) {
    this.createPermission = this.fb.group({
      id: [''],
      permission_name: ['', [Validators.required, Validators.minLength(3)]],
      guard_name: ['api', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listPermissionsData();
    this.listPermission();
  }
    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

   listPermissionsData(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      this.toastr.error('User ID not found in local storage');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.subscriptions.add(
      this.service.editAllUserWithoutAuth(parseInt(userId)).subscribe({
        next: (res: UserPermissionResponse) => {
          const permissionsList = res['user-permissions-list'];
          if (Array.isArray(permissionsList)) {
            this.listPermissionsDatas = permissionsList.map(perm => perm.name);
            this.permissioncreate = permissionsList.some(perm => perm.name === 'permission-create');
            this.permissionedit = permissionsList.some(perm => perm.name === 'permission-edit');
            this.permissiondelete = permissionsList.some(perm => perm.name === 'permission-delete');
          } else {
            this.toastr.error('Invalid permissions data received');
            this.listPermissionsDatas = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error, 'Failed to load permissions');
        }
      })
    );
  }

  private listPermission(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.service.listPermission().subscribe({
        next: (res: PermissionResponse) => {
          this.listPermissions = res.data;
                this.dtTrigger.next();

       
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error, 'Failed to load permission list');
        }
      })
    );
  }

  createPermissions(): void {
    this.submitted = true;
    if (this.createPermission.invalid) {
      return;
    }

    this.isLoading = true;
    this.subscriptions.add(
      this.service.createPermission(this.createPermission.value).subscribe({
        next: () => {
          this.listPermission();
          this.toastr.success('Permission created successfully!');
          this.resetForm();
        },
        error: (error) => {
          this.handleError(error, 'Failed to create permission');
        }
      })
    );
  }

  editPermission(id: number): void {
    this.update = true;
    this.save = false;
    this.currentId = id;

    this.subscriptions.add(
      this.service.editPermission(id).subscribe({
        next: (res: { data: Permission }) => {
          this.createPermission.patchValue({
            id: res.data.id,
            permission_name: res.data.name,
            guard_name: res.data.guard_name
          });
          this.myModal.show();
        },
        error: (error) => {
          this.handleError(error, 'Failed to load permission');
        }
      })
    );
  }

  updatePermission(): void {
    if (this.createPermission.invalid) {
      return;
    }

    this.isLoading = true;
    this.subscriptions.add(
      this.service.updatePermission(this.createPermission.value).subscribe({
        next: () => {
          this.listPermission();
          this.toastr.success('Permission updated successfully!');
          this.resetForm();
        },
        error: (error) => {
          this.handleError(error, 'Failed to update permission');
        }
      })
    );
  }

  deletePermission(id: number): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.service.deletePermission(id).subscribe({
        next: () => {
          this.listPermission();
          this.toastr.success('Permission deleted successfully!');
          this.myModals.hide();
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error, 'Failed to delete permission');
        }
      })
    );
  }

  show(id: number): void {
    this.currentId = id;
    this.myModals.show();
  }

  showPermission(): void {
    this.update = false;
    this.save = true;
    this.resetForm();
    this.myModal.show();
  }

  close(): void {
    this.myModal.hide();
    this.resetForm();
  }

  private resetForm(): void {
    this.createPermission.reset({
      id: '',
      permission_name: '',
      guard_name: 'api'
    });
    this.submitted = false;
    this.myModal.hide();
  }

  private handleError(error: any, message: string): void {
    this.isLoading = false;
    const errorMessage = error?.error?.message || 'An error occurred';
    this.toastr.error(`${message}: ${errorMessage}`);
    this.myModal.hide();
    this.myModals.hide();
  }

  get registerFormControl() {
    return this.createPermission.controls;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}