import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MasterService } from '../../../../_service/master/master.service';
import { PfserviceService } from '../../../../_service/pf/pfservice.service';
import { UserService } from '../../../../_service/user.service';

@Component({
  selector: 'app-introductive-details',
  templateUrl: './introductive-details.component.html',
  styleUrls: ['./introductive-details.component.scss']
})
export class IntroductiveDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  @Input() companyId!: number;

  dtOptions: any = {};
  isCollapsed: boolean = false;
  introducer!: FormGroup;
  introducers: any;
  ids: any;
  org_Id: any;
  save: boolean = true;
  update: boolean = false;
  stakeHolder: any;
  branch_names: any;
  department_names: any;
  getDepartmentList: any;
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pfservice: PfserviceService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private masterservice: MasterService,
    private userservice: UserService
  ) { }

  /** Handle @Input() changes */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['companyId'] && changes['companyId'].currentValue) {
      const id = changes['companyId'].currentValue;
      console.log('Updated companyId:', id);
      if (this.introducer) {
        this.introducer.patchValue({ introducer_company_id: id });
      }
      this.getIntroducersByCompanyId(id);
      this.isCollapsed = true;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.employeeListFrmStakeHolder();
  }

  /** Initialize form */
  initForm() {
    this.introducer = this.fb.group({
      introducer_id: [''],
      introducer_business_code: ['', [Validators.required]],
      introducer_company_id: [''],
      introducer_branch: ['', [Validators.required]],
      introducer_department: ['', [Validators.required]],
      percentage_share: ['', [Validators.required]],
    });

    // Patch companyId if already available at init
    if (this.companyId) {
      this.introducer.patchValue({ introducer_company_id: this.companyId });
      this.getIntroducersByCompanyId(this.companyId);
      this.isCollapsed = true;
    }
  }

  /** Form submit */
  createIntroducer() {
    this.submitted = true;

    if (this.introducer.invalid) return;

    this.isLoading = true;
    this.pfservice.CreateIntroducer(this.introducer.value).subscribe(
      res => {
        this.isLoading = false;
        this.introducer.reset({ introducer_company_id: this.companyId }); // keep companyId after reset
        this.toastr.success('Created Successfully!');
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  /** Get Stakeholder, Branch and Department lists */
  employeeListFrmStakeHolder() {
    this.masterservice.getStakeHolderDetails().subscribe(
      res => {
        this.stakeHolder = res['data'];
        this.getBranch();
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  getBranch() {
    this.userservice.getBranchlist().subscribe(
      res => {
        this.branch_names = res['data'];
        this.getDepartment();
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  getDepartment() {
    this.userservice.getDepartment().subscribe(
      res => this.department_names = res,
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  /** Get Introducers by Company ID */
  getIntroducersByCompanyId(companyId: number) {
    this.pfservice.getIntroducersByCompanyId(companyId).subscribe(
      res => {
        this.introducers = res;
        this.dtTrigger.next();
      },
      error => this.toastr.error(error['statusText'] + ". " + error.error.message)
    );
  }

  /** Delete introducer */
  deleteIntroducers(id: any) {
    this.isLoading = true;
    this.pfservice.deleteIntroducers(id).subscribe(
      res => {
        this.isLoading = false;
        this.toastr.success('Deleted Successfully!');
        if (this.companyId) this.getIntroducersByCompanyId(this.companyId);
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  /** Patch form to edit introducer */
  getIntroducerById(id: any) {
    this.isLoading = true;
    this.pfservice.getIntroducresById(id).subscribe(
      res => {
        this.isLoading = false;
        this.save = false;
        this.update = true;
        const data = res[0];
        this.introducer.patchValue({
          introducer_id: data['introducer_id'],
          introducer_business_code: data['introducer_business_code'],
          introducer_company_id: data['introducer_company_id'],
          introducer_branch: data['introducer_branch'],
          introducer_department: data['introducer_department'],
          percentage_share: data['percentage_share'],
        });
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  /** Update introducer */
  updateIntroducerById() {
    if (!this.introducer.value.introducer_id) return;

    this.isLoading = true;
    this.pfservice.updateIntroducers(this.introducer.value.introducer_id, this.introducer.value).subscribe(
      res => {
        this.isLoading = false;
        this.introducer.reset({ introducer_company_id: this.companyId });
        this.toastr.success('Updated Successfully!');
        this.save = true;
        this.update = false;
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  /** Keep companyId after form reset */
  create() {
    this.employeeListFrmStakeHolder();
    this.initForm();
  }

  /** Optional: branch change triggers department load */
  changeBranch() {
    const branchId = this.introducer.value.introducer_branch;
    if (!branchId) return;

    this.isLoading = true;
    this.userservice.listBranchById(branchId).subscribe(
      res => {
        this.getDepartmentList = res['data'];
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.toastr.error(error['statusText'] + ". " + error.error.message);
      }
    );
  }

  get registerFormControl() {
    return this.introducer.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
