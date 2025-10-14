import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { UserService } from '../../_service/user.service';
import { PfserviceService } from '../../_service/pf/pfservice.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../_service/GF-API/company.service';

@Component({
  selector: 'app-organization-registration',
  templateUrl: './organization-registration.component.html',
  styleUrls: ['./organization-registration.component.scss']
})
export class OrganizationRegistrationComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  @Input() companyId!: string;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private userservice: UserService, private PFservice: PfserviceService,  private gfcompanyservice: CompanyService,
    private route: ActivatedRoute,
    private pfservice: PfserviceService,
    private fb: FormBuilder,
    private router: Router,
    private tosatr: ToastrService,
    private uservice: UserService) { }
  listPermission = []
  createcompany: boolean = false;
  companyEdit: boolean = false;
  companyDelete: boolean = false;
  isLoading: boolean = false;
  activeTab: number = 1;
  selectedCompanyId: number
  findAllCompany: any[] = [];
  reg_type: boolean = false;
  ngOnInit(): void {
    this.fetchCompanyDetails();
    this.listpermission();
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

  listpermission() {
    this.userservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res => {
      for (let j = 0; j < res['user-permissions-list'].length; j++) {
        this.listPermission[j] = res['user-permissions-list'][j].name
        if (this.listPermission[j] == 'company-create') {
          this.createcompany = true;

        } else if (this.listPermission[j] == 'company-edit') {
          this.companyEdit = true;
        } else if (this.listPermission[j] == 'company-delete') {
          this.companyDelete = true;
        }
      }
    })
  }
  closeModal() {
    this.fetchCompanyDetails()
    this.myModals.hide();
  }
  editpfCompaneyRegistrationByIds(data) {
 
     this.selectedCompanyId = data.company_id;
    this.organizationRegistration.patchValue({
      
          company_id: data.company_id,
       
        });
   
    this.openCreateCompanyModal();
    this.loadCompanyDetails();

  }
  lumpsum_individual = [
    { lumpsum_individual: 'Lumpsum' },
    { lumpsum_individual: 'Individual' }
  ];
  async fetchCompanyDetails() {
    this.isLoading = true;
    await this.PFservice.findAllCompany().subscribe(res => {
      this.isLoading = false;
      // if(res['success']){
      this.findAllCompany = res;
      // }
      this.dtTrigger.next();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] + ". " + error.error.message);
    })
  }
  openCreateCompanyModal() {
    this.myModals.show();
  }

  selectedTab(index: number) {
    console.log(index)

    this.activeTab = index;
  }


  isCollapsed: boolean = true;
  organizationRegistration!: FormGroup;
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

  interest_types = [
    { interest_type: 'Compound Interest' },
    { interest_type: 'Simple Interest' }
  ]
  editRegistrations() {
    this.edit = false;
    this.update = true;
    this.save = false;
    this.isDisabled = false;
  }
  status = [
    { company_status: 'Active' },
    { company_status: 'Closed' }
  ]
  initForm() {
    this.organizationRegistration = this.fb.group({
      id: [],
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
      interest_type: ['', [Validators.required]],
      registered_as: [''],
    });
  }

  loadCompanyDetails() {
    this.isLoading = true;
    this.pfservice.findcompanyById(this.organizationRegistration.value).subscribe(
      res => {
        this.isLoading = false;
        const data = res[0];
        if(data.registration_type =='GF'){
          this.reg_type = true;
        }else{
          this.reg_type = false;
        }
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
          interest_type: data.interest_type,
          registered_as: data.registered_as
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
  onRegistrationTypeChange() {
    const selectedType = this.organizationRegistration.get('registration_type').value;
    if (selectedType === 'GF') {
      this.reg_type = true;
    } else {
      this.reg_type = false;
    }
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
          this.organizationRegistration.patchValue({ data: res.data });
          this.selectedCompanyId = res.data.company_id;
           this.reg_type = false;
          this.isLoading = false;
          this.save = false;
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
          if (res) {
            this.organizationRegistration.patchValue({ data: res.data });
            this.selectedCompanyId = res.data.company_id;
            this.reg_type = true;
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
  updatePfCompaney() {
    const value = this.organizationRegistration.value;

    if (value.registration_type === 'PF') {
      this.pfservice.updatepfCompaneyRegistration(this.organizationRegistration.value.company_id, value).subscribe(
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
      this.gfcompanyservice.updategfCompaneyRegistration(this.organizationRegistration.value.id, value).subscribe(
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
