import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-departmentlist',
  templateUrl: './departmentlist.component.html',
  // styleUrls: ['./departmentlist.component.scss']
})
export class DepartmentlistComponent implements OnInit,OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  createbranchs: FormGroup;
  listDepartmentvalue;
  editpopup;
  departmentname;
  department;
  department_name: any
  department_id: BigInt;
  createDepartment: FormGroup;
  save;
  update;
  constructor(private fb: FormBuilder, private service: UserService, private route: Router, private router: ActivatedRoute,private tosatr: ToastrService) { }
  ngOnInit() {
    this.createdept();
    this.listDepartment();
    this.listpermissions()
  }
  departmentcreate;
  departmentEdit
  departmentDelete
  listPermissionsData = []
  listpermissions(){
    this.service.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
    
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'department-create'){
          this.departmentcreate = true;
        }else if(this.listPermissionsData[j] == 'department-edit'){
          this.departmentEdit = true;
        }else if(this.listPermissionsData[j] == 'department-delete'){
          this.departmentDelete = true;
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

  create() {

    this.myModal.show();
    this.save=true;
    this.createbranchs.reset();
    this.update=false;

  }

  createdept() {
    this.createDepartment = this.fb.group({
      department_name: [''],
      department_id: [''],
      department_code:['']
    })
  }
  createDepartname() {
    this.isLoading = true;
    this.service.createDepartment(this.createDepartment.value).subscribe(res => {
      this.listDepartment();
      this.isLoading = false;
      this.createDepartment.reset();
      this. ngOnDestroy();

      this.myModal.hide();

    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  listDepartment() {
    this.isLoading = true;
    this.service.listDepartname().subscribe(res => {
      this.listDepartmentvalue = res['data']
      this.isLoading = false;
      this.dtTrigger.next();
     this. ngOnDestroy();

    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  deleteDepartment(listDepartmentvalue) {
    this.isLoading = true;
    this.service.deleteDepartmentById(listDepartmentvalue).subscribe(res => {
      this.isLoading = false;
      this.listDepartment();
      this. ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  editDepartment(id) {
    this.save=false;
    this.update=true;
    this.service.editDepartmentList(id).subscribe(res => {
      this.myModal.show()
      this.createDepartment = this.fb.group({
        department_id: [res['data']["id"]],
        department_name: [res['data']["department_name"]],
        department_code:[res['data']["department_code"]]

      })
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  updateDepartname() {
    this.isLoading = true;
    this.service.updateDepartment(this.createDepartment.value).subscribe((res: any) => {
      this.isLoading = false;
      this.createDepartment.reset();
      this.listDepartment();
      this.myModal.hide();
      this. ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  close() {
    this.myModal.hide()
    this.createDepartment.reset();
  }
}
