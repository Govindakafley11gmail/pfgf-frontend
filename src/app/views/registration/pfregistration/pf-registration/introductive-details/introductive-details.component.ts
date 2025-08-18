import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MasterService} from '../../../../_service/master/master.service';
import {PfserviceService} from '../../../../_service/pf/pfservice.service';
import {UserService} from '../../../../_service/user.service';

$;
@Component({
  selector: 'app-introductive-details',
  templateUrl: './introductive-details.component.html',
  styleUrls: ['./introductive-details.component.scss']
})
export class IntroductiveDetailsComponent implements OnInit,OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
    @Input() companyId!: number;
  
  // dtOptions: DataTables.Settings = {};
  isCollapsed: boolean=false;
  introducer: FormGroup
  introducers;
  ids;
  org_Id;
  save:boolean=true;
  update;
  stakeHolder;
  branch_names;
  department_names
  isNotCollapsed;
  getDepartmentList;
  constructor(private route:ActivatedRoute,private pfservice: PfserviceService, private router: Router, private fb: FormBuilder, private tosatr: ToastrService, private masterservice: MasterService,private userservice:UserService) { }

  ngOnInit(): void {
    if( this.companyId){
      this.getIntroducersByCompanyId(this.companyId);
      this.employeeListFrmStakeHolder();
      this.isCollapsed = true;
    }else{
      this.isCollapsed = false;
    }
    this.Introducer();
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

  closepopup() {
    this.clearForm()
    this.myModal.hide()
  }
  clearForm() {

    this.introducer.reset({
      'introducer_company_id': '',
      'introducer_business_code': '',
      'introducer_name': '',
      'percentage_share': '',
    });
  }

  sid
  Introducer() {
    this.sid = this.route.snapshot.params['id'];
    this.introducer = this.fb.group({
      introducer_id: [''],
      introducer_business_code: ['',[Validators.required]],
      introducer_company_id: [this.route.snapshot.params['id']],
      introducer_branch:['',[Validators.required]],
      introducer_department:['',[Validators.required]],
      percentage_share: ['',[Validators.required]],
    })
  }

  changeBranch(){
    this.isLoading = true;
    this.userservice.listBranchById(this.introducer.value.introducer_branch).subscribe(res => {
      this.getDepartmentList = res['data'];
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  submitted
  createIntroducer() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.introducer.invalid) {
        return;
    }
    this.isLoading = true;
    this.pfservice.CreateIntroducer(this.introducer.value).subscribe(res => {
      this.isLoading = false;
      this.introducer.reset()
      // this.router.navigate(['./registration/pfregistrationlist'])
      this.tosatr.success('Created Successfull!!!');
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  employeeListFrmStakeHolder() {
    this.masterservice.getStakeHolderDetails().subscribe(res => {
      this.stakeHolder = res['data'];
      this.getBranch()

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getBranch() {
    this.userservice.getBranchlist().subscribe(res=>{
      this.branch_names = res['data']
      this.getDepartment();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getDepartment() {
    this.userservice.getDepartment().subscribe(res=>{
      this.department_names = res
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getIntroducersByCompanyId(companyId) {
    this.pfservice.getIntroducersByCompanyId(companyId).subscribe(res => {
      this.introducers = res;
      this.dtTrigger.next();
      this.ngOnDestroy();

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  show(id) {
    this.ids = id
  }

  deleteIntroducers(id) {
    this.isLoading = true;
    this.pfservice.deleteIntroducers(id).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Deleted Successfull!!!');
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getIntroducerById(id) {
    this.isLoading = true;
    this.pfservice.getIntroducresById(id).subscribe(res => {
      this.isLoading = false;
      this.save = false;
      this.update = true;
      this.introducer = this.fb.group({
        id: [res[0]['id']],
        introducer_id: [res[0]['introducer_id']],
        introducer_business_code: [res[0]['introducer_business_code']],
        introducer_company_id: [res[0]['introducer_company_id']],
        introducer_branch:[res[0]['introducer_branch']],
        introducer_department:[res[0]['introducer_department']],
        percentage_share: [res[0]['percentage_share']],
      })
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  updateIntroducerById() {
    this.isLoading = true;
    this.pfservice.updateIntroducers(this.introducer.value.id, this.introducer.value).subscribe(res => {
      this.isLoading = false;
      this.introducer.reset()
      this.tosatr.success('Updated Successfull!!!');
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  create() {
    this.employeeListFrmStakeHolder();
    if (this.route.snapshot.params['id']) {
      this.Introducer();
      this.save = true;
      this.update = false;
      this.org_Id = localStorage.getItem(('org_id'));
      this.ngOnDestroy();
    } else {
      this.tosatr.warning('Failed to Create PF-Orginization and MOU!!!');
    }

  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  get registerFormControl() {
    return this.introducer.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
