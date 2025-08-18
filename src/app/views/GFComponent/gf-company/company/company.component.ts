import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {CompanyService} from '../../../_service/GF-API/company.service';
import {PfemployeeService} from '../../../_service/pfemployee/pfemployee.service';
import {UserService} from '../../../_service/user.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  isCollapsed: boolean = true;
  constructor(private pfemployee:PfemployeeService,private route: ActivatedRoute, private gfcompanyservice:CompanyService, private fb: FormBuilder, private router: Router, private tosatr: ToastrService, private uservice: UserService) { }
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
  save;
  update
  com_reg;
  moudetail;
  isDisabled
  dropdownDisable;
  dropdownEnable;
  dzongkhag;
  pfEmployee:FormGroup
  employeeOflampsum
  companyid
  gfaccCompanyId
  number
  getitByCompanyId
  gfaccno
  lampsum
  identification_type
  sectorWiseData
  ngOnInit(): void {
    this.lampsum = false
    this.CompaneyDetailformControl();
    //this.CompaneyMouformControl();
    this.getBranchName();
    this.getOrgtypes();
    this.saveButton = true;
    this.buttonHandelInedit();
    this.getDzongkhag();
    this.fetchDataSectorWise();
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
  getOrgtypes() {
    if (localStorage.getItem('access_token')) {
      this.gfcompanyservice.orgtypes().subscribe(res => {
        this.orgTypes = res;
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false
      })
    } else {
      this.router.navigate(['/login'])
      localStorage.removeItem('access_token');
      localStorage.removeItem('userName');
    }
  }

  getDzongkhag() {
    this.isLoading = true;
    this.gfcompanyservice.getAllDzongkhag().subscribe(res => {
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
      dzongkhag_id: ['', [Validators.required]],
      phone_no: [''],
      sector_type: new FormControl(''),
      email_id: [''],
      website: [''],
      post_box_no: [''],
      reg_branch: ['', [Validators.required]],
      registered_as: new FormControl(''),
      total_gf_amount: new FormControl(''),
      pf_emp_acc_no: new FormControl(''),
      mou_ref_no: ['', [Validators.required]],
      mou_date: ['', [Validators.required]],
      mou_expiry_date: ['', [Validators.required]],
      interest_rate: ['', [Validators.required, Validators.max(7), Validators.min(0)]],
    })
    this. identificationType()
  }

  buttonHandelInedit() {
    if (this.route.snapshot.params['id']) {
      this.edit = true;
      this.save = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
      this.isLoading = true;
      this.gfcompanyservice.editPfCompaneyById(this.ids).subscribe(res => {
        console.log(res)
        this.isLoading = false;
        this.isDisabled = true;
        this.comp_reg = res
        this.com_regs = res['Data'][0];
        this.moudetail = res['Data'][0].get_gf_mou_details;
        this.organizationRegistration = this.fb.group({
          company_account_no:[this.com_regs['company_account_no']],
          company_id: [this.com_regs['company_id']],
          org_name: [this.com_regs['org_name']],
          license_no: [this.com_regs['license_no']],
          license_validity: [this.com_regs['license_validity']],
          bit_cit_no: [this.com_regs['bit_cit_no']],
          org_type: [this.com_regs['org_type']],
          address: [this.com_regs['address']],
          dzongkhag_id: [this.com_regs['dzongkhag_id']],
          phone_no: [this.com_regs['phone_no']],
          email_id: [this.com_regs['email_id']],
          website: [this.com_regs['website']],
          post_box_no: [this.com_regs['post_box_no']],
          reg_branch: [this.com_regs['reg_branch_id']],
          sector_type: new FormControl(this.com_regs['sector_type']),
          registered_as: new FormControl(this.com_regs['registered_as']),
          total_gf_amount: new FormControl(this.com_regs['lampsum_amount']),
          pf_emp_acc_no: new FormControl(this.com_regs['pf_emp_acc_no']),
          mou_ref_no: [this.moudetail['mou_ref_no']],
          mou_date: [this.moudetail['mou_date']],
          mou_expiry_date: [this.moudetail['mou_expiry_date']],
          interest_rate: [Math.round(parseFloat(this.moudetail['interest_rate'])*100)/100],
        })
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false
      })

    } else {
      this.save = true;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
    }
  }
  identificationType() {
    this.isLoading = true;
    this.pfemployee.identificationType().subscribe(res => {
      this.isLoading = false;
      this.identification_type = res
      console.log(res)
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  
  ids = this.route.snapshot.params['id']
  editRegistrations() {
    if (this.ids) {
      this.edit = false;
      this.save = false;
      this.cancel = true;
      this.update = true
      this.isDisabled = false;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
    } else {
      this.save = true;
    }
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
    console.log(this.organizationRegistration.value)

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
  getBranchName() {
    this.uservice.getBranchlist().subscribe(res => {
      this.reg_branch = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
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
        this.gfcompanyservice.gfCompaneyRegistration(this.organizationRegistration.value).subscribe(res => {
          this.isLoading = false;
          console.log(res)
          if(res['message']){
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
    else {
      this.tosatr.warning('Filled up the Form!!!');
    }
  }

  lampsumOrindividual = [
    {lampsum: 'Lumpsum'},
    {lampsum:'Individual'}
  ]

  create() {
    this.myModal.show();
    // this.createRole.reset();
  }
  changeLampsumIndividual(){
    if(this.organizationRegistration.value.registered_as == 'Lumpsum') {
      this.lampsum = true;
    }else{
      this.lampsum = false
    }
  }
  get registerFormControl() {
    return this.organizationRegistration.controls;
  }
  fetchDataSectorWise(){
    this.uservice.fetchDataSectorWise().subscribe(res => {
      this.sectorWiseData = res;
      console.log(res)
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

}
