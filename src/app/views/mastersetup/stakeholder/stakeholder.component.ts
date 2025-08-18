import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MasterService} from '../../_service/master/master.service';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-stakeholder',
  templateUrl: './stakeholder.component.html',
  styleUrls: ['./stakeholder.component.scss']
})
export class StakeholderComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  isCollapsed: boolean = true;
  stakeHolderDetail:FormGroup;
  stakeholder;
  ids;
  partytype;
  save;
  update;
  constructor(private pfservice: MasterService, private fb: FormBuilder, private router: Router, private tosatr: ToastrService,private service:UserService) { }


  ngOnInit(): void {
    this.stakeHolderFormControl();
    this.getStakeHolderDetails();
    this.getpartytype();
    this. listpermissions();
  }
  stakeHoldercreate;
  stakeHolderEdit
  stakeHolderDelete
  listPermissionsData = []
  listpermissions(){
    this.service.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermissionsData[j] =  res['user-permissions-list'][j].name
        if(this.listPermissionsData[j] == 'stakeholder-create'){
          this.stakeHoldercreate = true;
        }else if(this.listPermissionsData[j] == 'stakeholder-edit'){
          this.stakeHolderEdit = true;
        }else if(this.listPermissionsData[j] == 'stakeholder-delete'){
          this.stakeHolderDelete = true;
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
  stakeHolderFormControl() {
    this.stakeHolderDetail = this.fb.group({
      id: new FormControl(''),
      stakeholder_name: new FormControl('',[Validators.required]),
      stakeholder_party_type : new FormControl('',[Validators.required]),
      employee_id: new FormControl(''),
      tpn_no: new FormControl(''),
      bank_account_no: new FormControl(''),
      bank_name: new FormControl(''),
    });
  }
  submitted
  createStakeHolderDetail() {
    if(this.stakeHolderDetail.valid){
      this.isLoading = true;
     this.pfservice.createStakeHolderDetails(this.stakeHolderDetail.value).subscribe(res=>{
      this.myModal.hide();
      this.stakeHolderDetail.reset();
      this.isLoading = false;
      this.getStakeHolderDetails()
      this.tosatr.success('Created successfully!!!');
      this.ngOnDestroy();
     },error=>{
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
     });
    }else{
      this.submitted = true;
      return;
    }
  }
  getStakeHolderDetails(){
    this.isLoading = true;
    this.pfservice.getStakeHolderDetails().subscribe(res=>{
      this.stakeholder=res['data']
      this.isLoading = false
      this.dtTrigger.next();
      this.ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  getpartytype() {
    this.pfservice.getpartytypeDetails().subscribe(res=>{
      this.partytype=res['data'];

      console.log(res)
    })
  }
  show(id){
    this.ids  = id;
    this.myModals.show();
  }
  deleteStakeHolderById(id) {
    this.pfservice.deleteStakeHolderDetailsById(id).subscribe(res=>{
      this. getStakeHolderDetails();
      this.tosatr.success('Deleted successfully!!!')
      this.myModals.hide();
      this.ngOnDestroy();
      console.log(res)
    },error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
      this.myModals.hide();
    })
  }
  editStakeHolderById(id) {
    this.pfservice.getStakeHolderById(id).subscribe(res => {
      this.save = false;
      this.update = true;
     this.myModal.show();
      // this.getBranchName();
      console.log(res)
      this.stakeHolderDetail = this.fb.group({
        id: new FormControl(res['data']['id']),
        stakeholder_name: new FormControl(res['data']['stakeholder_name']),
        stakeholder_party_type: new FormControl(res['data']['stakeholder_party_type']),
        employee_id: new FormControl(res['data']['employee_id']),
        tpn_no: new FormControl(res['data']['tpn_no']),
        bank_account_no: new FormControl(res['data']['bank_account_no']),
        bank_name: new FormControl(res['data']['bank_name']),
      });
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    });
  }

  updataStakeHolderById(id,data) {
    this.isLoading = true;
      this.pfservice. updataStakeHolderById(this.stakeHolderDetail.value.id,this.stakeHolderDetail.value).subscribe(res=>{
        this.myModal.hide();
        this.stakeHolderDetail.reset();
        this.isLoading = false;
        this. getStakeHolderDetails();
        this.tosatr.success('Updated successfully!!!')
        this.ngOnDestroy();
      },error=>{
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      });
  }
  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.myModal.show()
    this.stakeHolderDetail.reset();
    this.save = true;
    this.update = false;
    // this.createRole.reset();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  get registerFormControl() {
    return this.stakeHolderDetail.controls;
  }

}
