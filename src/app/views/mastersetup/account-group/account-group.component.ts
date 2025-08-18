import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MasterService} from '../../_service/master/master.service';
import { UserService } from '../../_service/user.service';
import {Whitespace} from '../whitespace';

@Component({
  selector: 'app-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.scss']
})
export class AccountGroupComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();

  accountGroup: FormGroup;
  accountgroup
  ids;
  save;
  update;

  constructor(private pfservice: MasterService, private fb: FormBuilder, private router: Router, private tosatr: ToastrService,private userService:UserService) { }


  ngOnInit(): void {
    this.AccountgroupFormControl();
    this.getAccountGroupDetails();
    this.listpermissions();
  }
  accountgroupcreate;
  accountgroupedit
  accountgroupdelete
  listPermissionsData = []
  listpermissions(){
    this.userService.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'accountgroup-create'){
          this.accountgroupcreate = true;
        }else if(this.listPermissionsData[j] == 'accountgroup-edit'){
          this.accountgroupedit = true;
        }else if(this.listPermissionsData[j] == 'accountgroup-delete'){
          this.accountgroupdelete = true;
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

  branchWise = [
    { branchwise: 'Yes' },
    { branchwise: 'No' }
  ]
  partyType = [
    { partytype: 'Employee' },
    { partytype: 'Service Provider' },
    { partytype: 'Benificry' }
  ]

  AccountgroupFormControl() {
    this.accountGroup = this.fb.group({
      id: [''],
      account_group_code: ['', [Validators.required, Whitespace.noWhiteSpace]],
      account_group_name: ['', [Validators.required]],
      branch_wise: ['', [Validators.required]]
    })
  }

  // 17803953
submitted:any;
  createAccountGroup() {
    console.log(this.accountGroup.value);
    if(this.accountGroup.invalid){
      this.submitted = true;
      return;
    }
    else {
      this.isLoading = true;
      this.pfservice.createAccountGroupDetails(this.accountGroup.value).subscribe(res => {
        this.isLoading = false;
        this.myModal.hide();
        this.accountGroup.reset();
        this.getAccountGroupDetails();
        this.tosatr.success('Created successfully!!!')
        this.ngOnDestroy();
      }, error => {
        this.isLoading = false;
       this.tosatr.error(error['statusText'] +". "+error.error.message);
      })
    }
  }
  getAccountGroupDetails() {
    this.isLoading = true;
    this.pfservice.getAccountGroupDetails().subscribe(res => {
      this.accountgroup = res['data']
      this.dtTrigger.next();
      this.isLoading = false;
      this.ngOnDestroy();

    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  show(id) {
    this.ids = id;
    console.log(id)
    this.myModals.show();
  }
  deleteAccountGroupById(id) {
    this.isLoading = true;
    this.pfservice.deleteAccountGroupById(id).subscribe(res => {
      this.getAccountGroupDetails();
      this.isLoading = false;
      this.tosatr.success('Deleted successfully!!!')
      this.myModals.hide();
      this.ngOnDestroy();
    }, error => {
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
      this.myModals.hide();
    })
  }
  getAccountGroupById(id) {
    localStorage.setItem('acc_group_id',id);
    this.pfservice.getAccountGroupById(id).subscribe(res => {
      this.save = false;
      this.update = true;
      this.myModal.show();
      this.accountGroup = this.fb.group({
        id: [res['data']['account_group_id']],
        account_group_code: [res['data']['account_group_code']],
        account_group_name: [res['data']['account_group_name']],
        branch_wise: [res['data']['branch_wise']]
      })
    },error=>{
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  updateAccountGroupById(id, data) {
    this.isLoading = true;
    this.pfservice.updateAccountGroupById(this.accountGroup.value.id, this.accountGroup.value).subscribe(res => {
      this.getAccountGroupDetails();
      this.myModal.hide();
      this.accountGroup.reset();
      this.isLoading = false;
      this.tosatr.success('Updated successfully!!!')
      this.ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.myModal.show()
    this.save = true;
    this.update = false;

    this.accountGroup.reset();
  }
  get registerFormControl() {
    return this.accountGroup.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
