import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  createbranchs: FormGroup;
  listDepartmentvalue;
  getBranchList;
  save;
  update;
  ids
  constructor(private fb: FormBuilder, private service: UserService, private router: Router,private tosatr: ToastrService) { }
  ngOnInit() {
    this.createbranch();
    this.listBranch();
    this.listpermissions()
  }
  branchcreate;
  branchEdit
  branchDelete
  listPermissionsData = []
  listpermissions(){
    this.service.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'branch-create'){
          this.branchcreate = true;
        }else if(this.listPermissionsData[j] == 'branch-edit'){
          this.branchEdit = true;
        }else if(this.listPermissionsData[j] == 'branch-delete'){
          this.branchDelete = true;
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

  show(id){
    this.ids  =id;
    this.myModals.show();
  }
  createbranch() {
    this.createbranchs = this.fb.group({
      branch_id: [''],
      branch_name: ['',[Validators.required]],
      branch_location: ['',[Validators.required]],
      branch_code: ['',[Validators.required]]
    })
  }
  createBranch() {
    this.isLoading = true;
    this.service.crerateBranch(this.createbranchs.value).subscribe(res => {
      this.isLoading = false;
      localStorage.setItem('branch_wise', res)
      this.myModal.hide();
      this.createbranchs.reset();
      this.listBranch();
      this.tosatr.success('Created successfully!!!');
      this.ngOnDestroy();

    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  listBranch() {
    this.isLoading = true;
    this.service.getBranchlist().subscribe(res => {
      this.getBranchList = res['data'];
      this.dtTrigger.next();
      this.isLoading = false;
      this.ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  deleteBranch(listBranchtvalue) {
    this.isLoading = true;
    this.service.deleteBranch(listBranchtvalue).subscribe(res => {
      this.listBranch();
      this.isLoading = false;
      this.ngOnDestroy();

      this.tosatr.success('Deleted successfully!!!');
      this.myModals.hide()
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  editBranch(id) {
    this.save = false;
    this.update = true;
    this.service.editBranch(id).subscribe(res => {

      this.myModal.show()
      this.createbranchs = this.fb.group({
        branch_id: [res['data']["id"]],
        branch_name: [res['data']["branch_name"]],
        branch_location: [res['data']['branch_location']],
        branch_code: [res['data']['branch_code']]
      })
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  } id;
  updateBranch() {
    this.isLoading = true;
    this.id = this.createbranchs.value.branch_id
    this.service.updateBranch(this.id, this.createbranchs.value).subscribe(res => {
      this.myModal.hide();
      this.listBranch();
      this.createbranchs.reset();
      this.isLoading = false;
      this.tosatr.success('Updated successfully!!!');
      this.ngOnDestroy();

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  close() {
    this.createbranchs.reset();
    this.myModal.hide()
  }
  create() {
    this.createbranchs.reset();
    this.myModal.show();
    this.save = true;
    this.update = false;

  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
