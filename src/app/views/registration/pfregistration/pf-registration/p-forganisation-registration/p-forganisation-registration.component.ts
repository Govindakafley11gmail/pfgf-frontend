import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { PfserviceService } from '../../../../_service/pf/pfservice.service';
import { UserService } from '../../../../_service/user.service';
import { CompanyService } from '../../../../_service/GF-API/company.service';

@Component({
  selector: 'app-p-forganisation-registration',
  templateUrl: './p-forganisation-registration.component.html',
  styleUrls: ['./p-forganisation-registration.component.scss']
})
export class PFOrganisationRegistrationComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @Input() companyId!: number;

  isCollapsed: boolean = true;
  activeTab: number = 1;

  organizationRegistration!: FormGroup;
  isLoading = false;
  reg_branch;
  dzongkhag;
  orgTypes;
  sectorWiseData;
  edit = true;
  save = true;
  update;
  cancel;
  isDisabled;
  dropdownDisable;
  dropdownEnable;

  constructor(
    private gfcompanyservice: CompanyService,
    private route: ActivatedRoute,
    private pfservice: PfserviceService,
    private fb: FormBuilder,
    private router: Router,
    private tosatr: ToastrService,
    private uservice: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();


    if (this.companyId) {
      this.organizationRegistration.patchValue({ company_id: this.companyId });
      this.loadCompanyDetails();
    }
    this.getBranchName();
    this.getOrgtypes();
    this.getDzongkhag();
    this.fetchDataSectorWise();
  }
  interest_types = [
    {interest_type:'Compound Interest'},
    {interest_type:'Simple Interest'}
  ]
editRegistrations(){
  this.edit =false;
  this.update=true;
  this.save=false;
  this.isDisabled = false;
}
status = [
  {company_status:'Active'},
  {company_status:'Closed'}
]
  initForm() {
    this.organizationRegistration = this.fb.group({
      id:[],
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
      status: ['', [Validators.required]],
      registration_type: ['', [Validators.required]],
      interest_type: ['', [Validators.required]]
    });
  }

  loadCompanyDetails() {
    this.isLoading = true;
    this.pfservice.findcompanyById(this.organizationRegistration.value).subscribe(
      res => {
        this.isLoading = false;
        const data = res[0];
        this.organizationRegistration.patchValue({
          id: data.id,
          registration_type: data.registration_type,
          company_account_no: data.company_account_no,
          company_id: data.company_id,
          org_name: data.org_name,
          license_no: data.license_no,
          license_validity: data.license_validity,
          bit_cit_no: data.bit_cit_no,
          org_type: data.org_type,
          address: data.address,
          dzongkhag_id: data.cmp_dzongkhag_id,
          phone_no: data.phone_no,
          email_id: data.email_id,
          website: data.website,
          post_box_no: data.post_box_no,
          reg_branch: data.reg_branch_id,
          mou_ref_no: data.mou_ref_no,
          mou_date: data.mou_date,
          mou_expiry_date: data.mou_expiry_date,
          interest_rate: Math.round(parseFloat(data.interest_rate) * 100) / 100,
          status: data.status,
          interest_type: data.interest_type
        });

        // Edit mode settings
        this.isDisabled = true;
        this.dropdownDisable = true;
        this.dropdownEnable = false;
        this.save = false;
      },
      error => {
        this.isLoading = false;
        this.tosatr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  getOrgtypes() {
    if (localStorage.getItem('access_token')) {
      this.pfservice.orgtypes().subscribe(res => (this.orgTypes = res));
    } else {
      this.router.navigate(['/login']);
      localStorage.removeItem('access_token');
      localStorage.removeItem('userName');
    }
  }

  getDzongkhag() {
    this.isLoading = true;
    this.pfservice.getAllDzongkhag().subscribe(
      res => {
        this.isLoading = false;
        this.dzongkhag = res;
      },
      error => {
        this.isLoading = false;
        this.tosatr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  getBranchName() {
    this.uservice.getBranchlist().subscribe(
      res => {
        if (res['success']) this.reg_branch = res['data'];
      },
      error => this.tosatr.error(error['statusText'] + ". " + error.error.message)
    );
  }

  fetchDataSectorWise() {
    this.uservice.fetchDataSectorWise().subscribe(
      res => (this.sectorWiseData = res),
      error => this.tosatr.error(error['statusText'] + ". " + error.error.message)
    );
  }

  companeyRegistrations(): void {
    if (this.organizationRegistration.invalid) {
      this.tosatr.warning('Fill up the Form!!!');
      return;
    }

    this.isLoading = true;
    const value = this.organizationRegistration.value;

    if (value.registration_type === 'PF') {
      this.pfservice.pfCompaneyRegistration(value).subscribe(
        res => {
           this.organizationRegistration.patchValue({data: res.data });
          this.isLoading = false;
          this.save= false;
          this.edit = true;
          this.update = false;
          this.isDisabled = true;
          this.tosatr.success('Created Successfully!!!');
        },
        error => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] + ". " + error.error.message);
        }
      );
    } else {
      this.gfcompanyservice.gfCompaneyRegistration(value).subscribe(
        res => {
          this.isLoading = false;
          if (res['message']) {
            res.patchValue(res['data']);

            this.save = false;
            this.edit = true;
            this.update = false;
            this.isDisabled = true;
            this.tosatr.error(res['message']);
          } else {
            this.tosatr.success('GF Organization Created Successfully');
          }
        },
        error => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] + ". " + error.error.message);
        }
      );
    }
  }
  updatePfCompaney(){
        const value = this.organizationRegistration.value;

    if (value.registration_type === 'PF') {
      this.pfservice.updatepfCompaneyRegistration(this.organizationRegistration.value.company_id,value).subscribe(
        res => {
          this.isLoading = false;
          this.tosatr.success('Updated Successfully!!!');
        },
        error => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] + ". " + error.error.message);
        }
      );
    } else {
      this.gfcompanyservice.updategfCompaneyRegistration(this.organizationRegistration.value.id,value).subscribe(
        res => {
          this.isLoading = false;
          if (res['message']) {
            this.tosatr.error(res['message']);
          } else {
            this.tosatr.success('GF Organization Created Successfully');
          }
        },
        error => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] + ". " + error.error.message);
        }
      );
    }
  }

  get registerFormControl() {
    return this.organizationRegistration.controls;
  }
}
