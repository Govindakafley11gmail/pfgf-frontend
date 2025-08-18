import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MasterService} from '../../_service/master/master.service';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  accounttype: FormGroup;
  accountTypeDetail;
  ids;
  depatment;
  isCollapsed: boolean = true;
  org_Id;
  accountgroupName;
  save;
  update;
  branchName;
  accountgroupid;
  number
  accountgroupids = ''
  constructor(private router: Router, private fb: FormBuilder, private Mservice: MasterService, private tosatr: ToastrService, private masterservice: MasterService, private userservice: UserService) { }


  ngOnInit(): void {
    this.AccountTypeFormcontrol()
    this.getAccountTypeDetails();
    // this.ShowAccountTypeDetails();
    this.getAccountGroupName();
    this.getCollectionBranchName();
    this.  listpermissions()
  }
  accountTypecreate;
  accountTypeedit
  accountTypedelete
  listPermissionsData = []
  listpermissions(){
    this.userservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
 
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'accounttype-create'){
          this.accountTypecreate = true;
        }else if(this.listPermissionsData[j] == 'accounttype-edit'){
          this.accountTypeedit = true;
        }else if(this.listPermissionsData[j] == 'accounttype-delete'){
          this.accountTypedelete = true;
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

  
  AccountTypeFormcontrol() {
    this.accounttype = this.fb.group({
      account_type_id: [''],
      account_group_id: [''],
      acc_code: ['', [Validators.required]],
      acc_name: ['', [Validators.required]],
      acc_nature: [''],
      acc_sub_ledger: [''],
      acc_description: [''],
      acc_branch_id: ['']
    })
  }
  accountNature = [
    { acc_nature: 'Assets' },
    { acc_nature: 'Expenses' },
    { acc_nature: 'Liability' },
    { acc_nature: 'Income' }
  ]
  submitted;
  createAccontTypeDetail() {
    console.log(this.accounttype.value)
    if (this.accounttype.valid) {
      this.isLoading = true;
      this.Mservice.createAccountTypeDetails(this.accounttype.value).subscribe(res => {
        this.isLoading = false;
        this.accounttype.reset();
        this.getAccountTypeDetails()
        this.tosatr.success('Created successfully!!!')
        this.myModal.hide();
        this.ngOnDestroy();
      }, error => {
        this.isLoading = false;
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.myModal.hide()
      })
    } else {
      this.tosatr.warning('Invalid Form!!!')
       this.submitted = true;
    }
  }

  getAccountTypeDetails() {
    this.isLoading = true;
    this.masterservice.getAccountTypeDetails().subscribe(res => {
      this.isLoading = false;
      this.accountTypeDetail = res['data'];
      if (this.accountTypeDetail != null) {
        this.dtTrigger.next();
        this.ngOnDestroy();
      }
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  account_group_id(event) {
    this.masterservice.getAccountGroupDetails().subscribe(res => {
      this.accountgroupid = res['data'];
      this.number = Object.keys(this.accountgroupid).length;
      for (let i = 0; i < this.number; i++) {
        for (let j = 0; j <= i; j++) {
          if (event.target.value === this.accountgroupid[j].account_group_code) {
            this.accounttype.patchValue({
              account_group_id : this.accountgroupid[j].account_group_id
            })
          }

        }

      }
    })
  }
  getAccountGroupName() {
    this.masterservice.getAccountGroupDetails().subscribe(res => {
      this.accountgroupName = res['data'];

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getCollectionBranchName() {
    this.userservice.getBranchlist().subscribe(res => {
      this.branchName = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  show(id) {
    this.ids = id
    this.myModals.show();
  }
  deleteAccountTypeDetailById(id) {
    this.isLoading = true;
    this.masterservice.deleteAccountTypeById(id).subscribe(res => {
      this.tosatr.success('Deleted successfully!!!')
      this.getAccountTypeDetails();
      this.myModals.hide();
      this.isLoading = false;
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  getAccountTypeById(id) {
    localStorage.setItem('acc_type_id', id);
    this.masterservice.getAccountTypeById(id).subscribe(res => {
      this.save = false;
      this.update = true;
      this.myModal.show()
      this.accounttype = this.fb.group({
        account_type_id: [res['data']['account_type_id']],
        account_group_id: [res['data']['account_group_id']],
        acc_code: [res['data']['acc_code']],
        acc_name: [res['data']['acc_name']],
        acc_nature: [res['data']['acc_nature']],
        acc_sub_ledger: [res['data']['acc_sub_ledger']],
        acc_description: [res['data']['acc_description']],
      })
    },error=>{
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  updateAccountTypeById() {
    this.masterservice.updateAccountTypeById(this.accounttype.value.account_type_id, this.accounttype.value).subscribe(res => {
      this.tosatr.success('Updated successfully!!!');
      this.getAccountTypeDetails()
      this.myModal.hide();
      this.accounttype.reset();
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.accounttype.reset();
    this.myModal.show();
    this.save = true;
    this.update = false;

  }

  get registerFormControl() {
    return this.accounttype.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
