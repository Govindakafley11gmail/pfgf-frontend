import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';

import {PfserviceService} from '../../../../_service/pf/pfservice.service';
import {UserService} from '../../../../_service/user.service';
import { CompanyService } from '../../../../_service/GF-API/company.service';

@Component({
  selector: 'app-p-forganisation-registration',
  templateUrl: './p-forganisation-registration.component.html',
  styleUrls: ['./p-forganisation-registration.component.scss']
})
export class PFOrganisationRegistrationComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
    @Input() companyId!: number;
      @Output() registrationDone = new EventEmitter<void>();

  isCollapsed: boolean = true;
  constructor( private gfcompanyservice:CompanyService ,private route: ActivatedRoute, private pfservice: PfserviceService, private fb: FormBuilder, private router: Router, private tosatr: ToastrService, private uservice: UserService) { }
  orgTypes;
  orginization;
  reg_branch;
  editButton;
  saveButton;
  cancel;
  cmp_id;
  comp_reg
  com_regs;
  orgtype;
  organizationRegistration: FormGroup;
  edit;
  save:boolean = true;;
  update
  com_reg;
  moudetail;
  isDisabled
  dropdownDisable;
  dropdownEnable;
  dzongkhag;
  sectorWiseData;
 
  ngOnInit(): void {
    this.CompaneyDetailformControl();
    //this.CompaneyMouformControl();
    this.getBranchName();
    this.getOrgtypes();
    this.saveButton = true;
    // this.buttonHandelInedit();
    this.getDzongkhag();
    this.fetchDataSectorWise();
  }
   ngOnChanges() {
  if (this.companyId) {
     this.organizationRegistration.patchValue({
        company_id: this.companyId,
      });
    this.buttonHandelInedit()
    // Fetch data or populate form based on companyId
  }
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
  status = [
    {'company_status': 'Active'},
    {'company_status': 'Closed'},
  ]
  getOrgtypes() {
    if (localStorage.getItem('access_token')) {
      this.pfservice.orgtypes().subscribe(res => {
        this.orgTypes = res;
      })
    } else {
      this.router.navigate(['/login'])
      localStorage.removeItem('access_token');
      localStorage.removeItem('userName');
    }
  }

  getDzongkhag() {
    this.isLoading = true;
    this.pfservice.getAllDzongkhag().subscribe(res => {
      this.isLoading = false;
      this.dzongkhag = res;
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  CompaneyDetailformControl() {
    this.organizationRegistration = this.fb.group({
      company_id: [''],
      org_name: ['', [Validators.required]],
      license_no: ['', [Validators.required]],
      license_validity: [''],
      bit_cit_no: [''],
      org_type: ['', [Validators.required]],
      address: ['', [Validators.required]],
      sector_type: new FormControl(''),
      dzongkhag_id: ['', [Validators.required]],
      phone_no: [''],
      email_id: [''],
      website: [''],
      post_box_no: [''],
      reg_branch: ['', [Validators.required]],
      mou_ref_no: ['', [Validators.required]],
      mou_date: ['', [Validators.required]],
      mou_expiry_date: ['', [Validators.required]],
      interest_rate: ['', [Validators.required, Validators.max(7), Validators.min(0)]],
      status: ['',[Validators.required]],
      registration_type:['', [Validators.required]],
      interest_type: ['',[Validators.required]]
    })
  }

  interest_types = [
    {'interest_type': 'Compount Interest'},
     {'interest_type': 'Simple Interest'}
  ]
  buttonHandelInedit() {
      this.edit = true;
      this.save = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
      this.isLoading = true;
     

      this.pfservice.findcompanyById(this.organizationRegistration.value).subscribe(res => {
        console.log('res',res);
        this.isLoading = false;
        this.isDisabled = true;
        this.organizationRegistration = this.fb.group({
          registration_type: [res[0]['registration_type']],
          company_account_no:[res[0]['company_account_no']],
          company_id: [res[0]['company_id']],
          org_name: [res[0]['org_name']],
          license_no: [res[0]['license_no']],
          license_validity: [res[0]['license_validity']],
          bit_cit_no: [res[0]['bit_cit_no']],
          org_type: [res[0]['org_type']],
          address: [res[0]['address']],
          dzongkhag_id: [res[0]['cmp_dzongkhag_id']],
          phone_no: [res[0]['phone_no']],
          email_id: [res[0]['email_id']],
          website: [res[0]['website']],
          post_box_no: [res[0]['post_box_no']],
          reg_branch: [res[0]['reg_branch_id']],
          mou_ref_no: [res[0]['mou_ref_no']],
          mou_date: [res[0]['mou_date']],
          mou_expiry_date: [res[0]['mou_expiry_date']],
          interest_rate: [Math.round(parseFloat(res[0]['interest_rate'])*100)/100],
          status: [res[0]['status'],[Validators.required]],
          interest_type:[res[0]['interest_type'], [Validators.required]],
        })
      })
  }

  editRegistrations() {
      this.edit = false;
      this.save = false;
      this.cancel = true;
      this.update = true
      this.isDisabled = false;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
  }
  cancelRegistrations() {
    this.cancel = false;
    this.isDisabled = true;
    this.edit = true;
    this.save = false;
    this.update = false;
    this.dropdownDisable = true;
    this.dropdownEnable = false;
  }


  updatePfCompaney() {
    this.isLoading = true;
    if (this.organizationRegistration.value.registration_type =='PF'){
 this.pfservice.updatepfCompaneyRegistration(this.organizationRegistration.value.company_id, this.organizationRegistration.value).subscribe(res => {
      this.cancel = false;
      this.isDisabled = true;
      this.edit = true;
      this.save = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
      this.isLoading = false;
      this.tosatr.success('Updated Successfull!!!');
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
    }else{
       this.gfcompanyservice.updategfCompaneyRegistration(this.organizationRegistration.value.company_id, this.organizationRegistration.value).subscribe(res => {
      this.cancel = false;
      this.isDisabled = true;
      this.edit = true;
      this.save = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
      this.isLoading = false;
      this.tosatr.success('GF Organization is Updated Successfull!!!');
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
    }
   
  }
  getBranchName() {
    this.uservice.getBranchlist().subscribe(res => {
      if(res['success']){
      this.reg_branch = res['data'];
      }
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  fetchDataSectorWise(){
    this.uservice.fetchDataSectorWise().subscribe(res => {
      this.sectorWiseData = res;
      console.log(res)
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  submitted
  companeyRegistrations(): void {
    console.log(this.organizationRegistration.value)
    this.submitted = true;

    // stop here if form is invalid
    if (this.organizationRegistration.invalid) {
      return;
    }

    if (this.organizationRegistration.valid) {
      this.isLoading = true;
      if(this.organizationRegistration.value.registration_type == 'PF'){
 this.pfservice.pfCompaneyRegistration(this.organizationRegistration.value).subscribe(res => {
        this.cmp_id = res['data'].company_id;
            this.registrationDone.emit();
        this.isLoading = false;
        this.editButton = true
        this.isDisabled = true;
        this.saveButton = false;
        this.tosatr.success('Created Successfull!!!');

      }, error => {
        this.isLoading = false;
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      })
      }else{
   this.gfcompanyservice.gfCompaneyRegistration(this.organizationRegistration.value).subscribe(res => {
          this.isLoading = false;
          console.log(res)
          if(res['message']){
                this.registrationDone.emit();
            this.tosatr.error(res['message']);
          }else{
            this.editButton = true;
            this.isDisabled = true;
            this.saveButton = false;
            this.cmp_id = res['data'].company_id;
            this.router.navigate(['./registration/company-registration', this.cmp_id])
            this.tosatr.success('GF Organization  is Created Successfully');
          }

        }, error => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
        })
      }
      // this.orginization = JSON.parse(JSON.stringify(this.organizationRegistration.value))
     
    }
    else {

      this.tosatr.warning('Filled up the Form!!!');
    }
  }

  create() {
    this.myModal.show();
    // this.createRole.reset();
  }
  get registerFormControl() {
    return this.organizationRegistration.controls;
  }

}
