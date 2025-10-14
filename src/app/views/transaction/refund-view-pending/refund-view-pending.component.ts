import { Component, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../_service/pf/pfservice.service';
import {UserService} from '../../_service/user.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../_service/GF-API/company.service';
import { PfemployeeService } from '../../_service/pfemployee/pfemployee.service';
import { CollectionService } from '../../_service/collection/collection.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-refund-view-pending',
  templateUrl: './refund-view-pending.component.html',
  styleUrls: ['./refund-view-pending.component.scss']
})
export class RefundViewPendingComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal1') public myModal1: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private collection: CollectionService,private pfservice: PfserviceService, private company: CompanyService, private http: HttpClient, private tosatr: ToastrService, private employee: PfemployeeService, private fb: FormBuilder, private route: Router, private master: UserService) { }
  approvedorpendind;
  formarray: FormGroup;
  approvedData: FormGroup;
  approved;
  viewNote = false;
  ngOnInit(): void {
    this.approved = true;
    this.getApprovedOrPendingDataList();
    this.approvependingData();
    this.approvedFormData();
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
  approvedFormData() {
    this.approvedData = this.fb.group({
      total_employee_contribution: new FormControl(''),
      total_employer_contribution: new FormControl(''),
      total_interest_on_employee_contribution: new FormControl(''),
      total_interest_on_employer_contribution: new FormControl(''),
      refund_ref_no: new FormControl(''),
      reg_branch_id: new FormControl(''),
      refund_company_id: new FormControl('', [Validators.required]),
      refund_processing_date: new FormControl('', [Validators.required]),
      refund_employee_cid: new FormControl('', [Validators.required]),
      refund_employee_id: new FormControl('', [Validators.required]),
      refund_employee_contribution: new FormControl('', [Validators.required]),
      refund_employer_contribution: new FormControl('', [Validators.required]),
      refund_interest_on_employee_contr: new FormControl('', [Validators.required]),
      refund_interest_on_employer_contr: new FormControl('', [Validators.required]),
      refund_total_contr: new FormControl('', [Validators.required]),
      refund_as_on_interest_employee: new FormControl('', [Validators.required]),
      refund_as_on_interest_employer: new FormControl('', [Validators.required]),
      refund_total_interest: new FormControl('', [Validators.required]),
      refund_total_disbursed_amount: new FormControl('', Validators.required),
      refund_net_refundable: new FormControl('', [Validators.required]),
      refund_file_name: new FormControl(''),
      refund_processed_remarks: new FormControl(''),
      emp_acc_no: new FormControl(''),
      org_name: new FormControl(''),
      employee_name: new FormControl(''),
      comp_acc_no: new FormControl(''),
      total_contribution: new FormControl(''),
      total_interest: new FormControl(''),
      prev_total_disbursed_amount: new FormControl(''),
      gross_refundable_amount: new FormControl(''),
      net_refundable_amount: new FormControl('')
    });
  }

  dataToApproved;
  downloadfile;
  employeeData;
  downloadfile2;
  companyData;
  isData;
  lastTransaction;
  Supporting = false;
  refundslipdocument = false;
  notesheet;
  viewRefunddata
  downloadfile3;
  refundslipdocument2
  ToBeApprovedListByredunfRefNo(id) {
    this.viewRefunddata = false;
    this.isLoading = true;
    this.pfservice.approvedRefundByRefNo(id).subscribe(res => {
      this.isLoading = false;
      this.myModal.show();
      this.dataToApproved = res[0];

      if (res[0].refund_processed_upload_docs.length > 1) {
        this.Supporting = true;
        this.refundslipdocument = true;
        this.downloadfile = res[0].refund_processed_upload_docs[0].doc_path;
        this.downloadfile2 = res[0].refund_processed_upload_docs[1].doc_path;
      } else {
        this.Supporting = false;
        this.refundslipdocument = true;
        this.downloadfile2 = res[0].refund_processed_upload_docs[0].doc_path;
      }

      this.employeeData = res[0].pf_refund_employee;
      this.companyData = res[0].company_details;
      this.lastTransaction = res[0].refund_transaction_data;

      this.approvedData = this.fb.group({
        registration_type: new FormControl(res[0].registration_type),
        total_employee_contribution: new FormControl(this.lastTransaction['total_employee_contribution']),
        total_employer_contribution: new FormControl(this.lastTransaction['total_employer_contribution']),
        total_interest_on_employee_contribution: new FormControl(Math.round(parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) * 100) / 100),
        total_interest_on_employer_contribution: new FormControl(Math.round(parseFloat(this.lastTransaction['total_interest_on_employer_contribution']) * 100) / 100),

        total_contribution: new FormControl(parseFloat(this.lastTransaction['total_employee_contribution']) + parseFloat(this.lastTransaction['total_employer_contribution'])),
        total_interest: new FormControl(Math.round((parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        prev_total_disbursed_amount: new FormControl(Math.round(parseFloat(this.lastTransaction['prev_total_disbursed_amount']) * 100) / 100),

        gross_refundable_amount: new FormControl(Math.round((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        net_refundable_amount: new FormControl(Math.round(((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) -
          parseFloat(this.lastTransaction['prev_total_disbursed_amount'])) * 100) / 100),

        org_name: new FormControl(this.companyData['org_name']),
        employee_name: new FormControl(this.employeeData['employee_name']),
        comp_acc_no: new FormControl(this.employeeData['company_pf_acc_no']),
        emp_acc_no: new FormControl(this.employeeData['pf_emp_acc_no']),
        refund_ref_no: new FormControl(this.dataToApproved['refund_ref_no']),
        reg_branch_id: new FormControl(this.dataToApproved['reg_branch_id'], [Validators.required]),
        refund_company_id: new FormControl(this.dataToApproved['pf_employee_company_id'], [Validators.required]),
        refund_processing_date: new FormControl(this.dataToApproved['refund_processing_date'], [Validators.required]),
        refund_employee_cid: new FormControl(this.employeeData['identification_no'], [Validators.required]),
        refund_employee_id: new FormControl(this.dataToApproved['pf_employee_id'], [Validators.required]),
        refund_employee_contribution: new FormControl(this.dataToApproved['refund_employee_contribution'], [Validators.required]),
        refund_employer_contribution: new FormControl(this.dataToApproved['refund_employer_contribution'], [Validators.required]),
        refund_interest_on_employee_contr: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_interest_on_employee_contr']) * 100) / 100, [Validators.required]),
        refund_interest_on_employer_contr: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_interest_on_employer_contr']) * 100) / 100, [Validators.required]),
        refund_total_contr: new FormControl(this.dataToApproved['refund_total_contr'], [Validators.required]),
        refund_as_on_interest_employee: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employee']) * 100) / 100, [Validators.required]),
        refund_as_on_interest_employer: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employer']) * 100) / 100, [Validators.required]),
        refund_total_interest: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_total_interest']) * 100) / 100, [Validators.required]),
        refund_total_disbursed_amount: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_total_disbursed_amount']) * 100) / 100, Validators.required),
        refund_net_refundable: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_net_refundable']) * 100) / 100, [Validators.required]),
        refund_file_name: new FormControl(this.dataToApproved['refund_file_name']),
        refund_processed_remarks: new FormControl(this.dataToApproved['refund_processed_remarks']),
      });
      console.log(this.approvedData.value)

    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }
  ToBeApprovedListByredunfRefNos(id) {
    this.isLoading = true;
    this.pfservice.approvedRefundByRefNo(id).subscribe(res => {
      this.viewRefunddata = true;
      this.isLoading = false;
      this.myModal.show();
      this.dataToApproved = res[0];

      if (res[0].refund_processed_upload_docs.length == 3) {
        this.Supporting = true;
        this.refundslipdocument = true;
        this.refundslipdocument2 = true;
        this.downloadfile = res[0].refund_processed_upload_docs[0].doc_path;
        this.downloadfile2 = res[0].refund_processed_upload_docs[1].doc_path;
        this.downloadfile3 = res[0].refund_processed_upload_docs[2].doc_path;
      }
       else if(res[0].refund_processed_upload_docs.length == 2) {
        this.refundslipdocument2 = true;
        this.Supporting = false;
        this.refundslipdocument = true;
        this.downloadfile2 = res[0].refund_processed_upload_docs[0].doc_path;
        this.downloadfile3 = res[0].refund_processed_upload_docs[1].doc_path;
      }

      this.employeeData = res[0].pf_refund_employee;
      this.companyData = res[0].company_details;
      this.lastTransaction = res[0].refund_transaction_data;

      this.approvedData = this.fb.group({
        registration_type: new FormControl(res[0].registration_type),
        total_employee_contribution: new FormControl(this.lastTransaction['total_employee_contribution']),
        total_employer_contribution: new FormControl(this.lastTransaction['total_employer_contribution']),
        total_interest_on_employee_contribution: new FormControl(Math.round(parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) * 100) / 100),
        total_interest_on_employer_contribution: new FormControl(Math.round(parseFloat(this.lastTransaction['total_interest_on_employer_contribution']) * 100) / 100),

        total_contribution: new FormControl(parseFloat(this.lastTransaction['total_employee_contribution']) + parseFloat(this.lastTransaction['total_employer_contribution'])),
        total_interest: new FormControl(Math.round((parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        prev_total_disbursed_amount: new FormControl(Math.round(parseFloat(this.lastTransaction['prev_total_disbursed_amount']) * 100) / 100),

        gross_refundable_amount: new FormControl(Math.round((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        net_refundable_amount: new FormControl(Math.round(((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) -
          parseFloat(this.lastTransaction['prev_total_disbursed_amount'])) * 100) / 100),

        org_name: new FormControl(this.companyData['org_name']),
        employee_name: new FormControl(this.employeeData['employee_name']),
        comp_acc_no: new FormControl(this.employeeData['company_pf_acc_no']),
        emp_acc_no: new FormControl(this.employeeData['pf_emp_acc_no']),
        refund_ref_no: new FormControl(this.dataToApproved['refund_ref_no']),
        reg_branch_id: new FormControl(this.dataToApproved['reg_branch_id'], [Validators.required]),
        refund_company_id: new FormControl(this.dataToApproved['pf_employee_company_id'], [Validators.required]),
        refund_processing_date: new FormControl(this.dataToApproved['refund_processing_date'], [Validators.required]),
        refund_employee_cid: new FormControl(this.employeeData['identification_no'], [Validators.required]),
        refund_employee_id: new FormControl(this.dataToApproved['pf_employee_id'], [Validators.required]),
        refund_employee_contribution: new FormControl(this.dataToApproved['refund_employee_contribution'], [Validators.required]),
        refund_employer_contribution: new FormControl(this.dataToApproved['refund_employer_contribution'], [Validators.required]),
        refund_interest_on_employee_contr: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_interest_on_employee_contr']) * 100) / 100, [Validators.required]),
        refund_interest_on_employer_contr: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_interest_on_employer_contr']) * 100) / 100, [Validators.required]),
        refund_total_contr: new FormControl(this.dataToApproved['refund_total_contr'], [Validators.required]),
        refund_as_on_interest_employee: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employee']) * 100) / 100, [Validators.required]),
        refund_as_on_interest_employer: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employer']) * 100) / 100, [Validators.required]),
        refund_total_interest: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_total_interest']) * 100) / 100, [Validators.required]),
        refund_total_disbursed_amount: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_total_disbursed_amount']) * 100) / 100, Validators.required),
        refund_net_refundable: new FormControl(Math.round(parseFloat(this.dataToApproved['refund_net_refundable']) * 100) / 100, [Validators.required]),
        refund_file_name: new FormControl(this.dataToApproved['refund_file_name']),
        refund_processed_remarks: new FormControl(this.dataToApproved['refund_processed_remarks']),
      });
      console.log(this.approvedData.value)

    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  downloadFile;
  downloadRefundFile(path) {

    console.log(path)
    if (path == undefined || path == '') {
      this.tosatr.error('No file Found');
    } else {
      this.isLoading = true;
      this.pfservice.downloadRefundFile(path).subscribe(res => {
        this.isLoading = false;

       
          let blob: any = new Blob([res], { type: 'application/' + path.split('.').pop() });
          const url = window.URL.createObjectURL(blob);

          open(url, path);
        
      }, error => {
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }

  }

  getApprovedOrPendingDataList() {
    this.isLoading = true;
    this.pfservice.getRefundVarifiedDetails().subscribe(res => {
      console.log(res)
      this.isLoading = false;
       
      this.approvedorpendind = res;
      if (res != null) {
        this.isData = true;
      } else {
        this.isData = false;
      }
     this.listpermission()
      this.dtTrigger.next();

    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  userRefundApproved;
  userRefundCreate
  verifyRefunds
// console.log(this.arrayPermissionarrayPermission)
 listPermission = []
  listpermission(){
    this.master.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'approve-refunds'){
          this.userRefundApproved = true;
        }else if(this.listPermission[j] == 'refund-process'){
          this.userRefundCreate = true;
        }else if(this.listPermission[j] == 'verify-refund'){
          this.verifyRefunds = true;
          console.log(this.listPermission[j])
        }
      }
    })
  }

  selectPendingFile(event) {

    if (event.target.files[0]) {
      const files = <File>event.target.files[0];
       const maxSizeInBytes = 5 * 1024 * 1024; // 2 MB
  if (files.size > maxSizeInBytes) {
      this.tosatr.error("Failed to approved because file size exceeds 5 MB.");
    return; // stop further processing
  }
      this.formarray.patchValue({
        approve_file_name: files
      })
    } else {

    }
  }
  approvependingData() {
    this.formarray = this.fb.group({
      refund_approved_remarks: new FormControl(''),
      approve_file_name: new FormControl(''),
      data: this.fb.array([], [Validators.required])
    });
  }
  // refund to be completed
  getApprovedData(pending, event, i) {
    this.approved = true
    console.log(pending)
    const data: FormArray = this.formarray.get('data') as FormArray;
    if (event.target.checked) {
      data.push(new FormControl(pending))
    } else {
      const index = data.controls.findIndex(x => x.value === pending);
      data.removeAt(index);
    }
  }
  refunduploadfile;
  dataLength;
  checkValidationApprovedData;
  checkApprovedRefund;
  submitApproveedData() {
    for (let i = 0; i < this.formarray.value.data.length; i++) {
      if (this.formarray.value.data[i].registration_type == 'PF') {
        this.checkValidationApprovedData = true;
        this.refunduploadfile = false;
        break;
      } else if(this.formarray.value.data[i].registration_type == 'GF') {
        this.checkValidationApprovedData = false;
        this.refunduploadfile = false;
        break;
      }else{
        
         return;
      }
    }
    if (this.checkValidationApprovedData) {
      this.pfApprovedRefund();
    } else if(!this.checkValidationApprovedData){
      this.gfApprovedRefund();
    }else{
      this.tosatr.error("Failed to approved because Registration Type is different.");
    }
  
  }

  pfApprovedRefund() {

    const formData = new FormData();
    formData.append("approve_file_name", this.formarray.get('approve_file_name').value);
    formData.append("data", JSON.stringify(this.formarray.get('data').value));
    formData.set("refund_approved_remarks", this.formarray.value.refund_approved_remarks);
    this.isLoading = true;
    this.pfservice.approvedfRefund(formData).subscribe(res => {
      this.isLoading = false;
      this.formarray.reset(this.formarray);
      this.formarray.reset(formData);
      if (res['message']) {
        this.tosatr.error(res['message']);
        this.formarray.reset(this.formarray);
        this.formarray.reset(formData);
      } else {
        this.tosatr.success('Refund Approved Successfully');
        this.formarray.reset(this.formarray);
        this.formarray.reset(formData);
        this.getApprovedOrPendingDataList();
        this.ngOnDestroy();
      }
    }, error => {
      this.formarray.reset(this.formarray);
      this.formarray.reset(formData);
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  gfApprovedRefund() {
    const formData = new FormData();
    formData.append("approve_file_name", this.formarray.get('approve_file_name').value);
    formData.append("data", JSON.stringify(this.formarray.get('data').value));
    formData.set("refund_approved_remarks", this.formarray.value.refund_approved_remarks);
    this.isLoading = true;
    this.company.approvedfRefund(formData).subscribe(res => {
      this.isLoading = false;
      if (res['message']) {
        this.tosatr.error(res['message']);
        this.formarray.reset(this.formarray);
        this.formarray.reset(formData);
      } else {
        this.tosatr.success('Refund Approved Successfully');
        this.formarray.reset(this.formarray);
        this.formarray.reset(formData);
        this.getApprovedOrPendingDataList();
        this.ngOnDestroy();
      }
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }


  verifyRefundConformation() {
    this.myModals.show();
  }
  // -------------create--
  toggle;
  refundShow;
  pfrefundscreen1: FormGroup;
  toggles;
  toggless;
  refundShowScreen2;
  toggles1;
  approverefund;
  org_name;
  employee_name;
  comp_acc_no;
  emp_acc_no;
  pfemployee_id;
  // downloadfile: String = '';
  // dataToApproved
  processing_date;
  pfrefundscreen2: FormGroup;
  process;
  companyname;
  pending;
  branch_names;
  comp_name;
  employeeName;
  employee_id;
  employee_cid;
  totaldistributionAmt;
  totalDisAmt;
  pfcontributions;
  refundCollection;
  lastTransactionData;
  previousDate;
  currentDate;
  noOfDays;
  asOnDateEmployeeInterest;
  asOnDateEmployerInterest;
  processing_message;
  employee_data;

  files
  get f() {
    return this.pfrefundscreen2.controls;
  }

  uploadFile(event) {

    const files = <File>event.target.files[0];
    this.pfrefundscreen2.patchValue({
      refund_file_name: files
    })
  }
  submitted

  submitPfRefund() {
    this.submitted = true;
    console.log(this.pfrefundscreen2.value)
    // stop here if form is invalid
    if (this.pfrefundscreen2.invalid) {
      this.tosatr.warning('Cannot submit refund some fields are empty !');
      return;
    }
    else {
      if (this.pfrefundscreen2.value.registration_type == 'PF') {
        this.pfRefundSubmit();
      } else {
        this.gfRefundSubmit()
      }
    }
  }

  pfRefundSubmit() {

    const formData = new FormData();
    formData.append('refund_file_name', this.pfrefundscreen2.get('refund_file_name').value);
    formData.set('interest_chargeable_amount_1', this.pfrefundscreen2.get('interest_chargeable_amount_1').value);
    formData.set('interest_chargeable_amount_2', this.pfrefundscreen2.get('interest_chargeable_amount_2').value);
    formData.set('reg_branch_id', this.pfrefundscreen2.get('id').value);
    formData.set('refund_company_id', this.pfrefundscreen2.get('refund_company_id').value);
    formData.set('refund_processing_date', this.pfrefundscreen2.get('refund_processing_date').value);
    formData.set('refund_employee_cid', this.pfrefundscreen2.get('refund_employee_cid').value);
    formData.set('refund_employee_id', this.pfrefundscreen2.get('refund_employee_id').value);
    formData.set('refund_employee_contribution', this.pfrefundscreen2.get('refund_employee_contribution').value);
    formData.set('refund_employer_contribution', this.pfrefundscreen2.get('refund_employer_contribution').value);
    formData.set('refund_interest_on_employee_contr', this.pfrefundscreen2.get('refund_interest_on_employee_contr').value);
    formData.set('refund_interest_on_employer_contr', this.pfrefundscreen2.get('refund_interest_on_employer_contr').value);
    formData.set('refund_total_interest', this.pfrefundscreen2.get('refund_total_interest').value);
    formData.set('refund_total_disbursed_amount', this.pfrefundscreen2.get('refund_total_disbursed_amount').value);
    formData.set('refund_net_refundable', this.pfrefundscreen2.get('refund_net_refundable').value);
    formData.set('refund_as_on_interest_employee', this.pfrefundscreen2.get('refund_as_on_interest_employee').value);
    formData.set('refund_as_on_interest_employer', this.pfrefundscreen2.get('refund_as_on_interest_employer').value);
    formData.set('refund_total_contr', this.pfrefundscreen2.get('refund_total_contr').value);
    formData.set('refund_amount', this.pfrefundscreen2.get('refund_amount').value);
    formData.set('refund_remarks', this.pfrefundscreen2.get('refund_remarks').value);
    formData.set('pf_emp_acc_no', this.pfrefundscreen2.get('pf_emp_acc_no').value);
    this.isLoading = true;
    this.pfservice.savePfRefund(formData).subscribe(res => {
      
      this.isLoading = false;
      console.log(res)
      if (res['message']) {
        this.tosatr.error(res['message']);
      } else {
        this.tosatr.success('Refund Process Successfully');
        this.myModal1.hide();
        this.getApprovedOrPendingDataList();
      }
      this.ngOnDestroy();
      // this.tosatr.success('Refund Submitted successfully');
    
    }, error => {
      console.log(error)
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  gfRefundSubmit() {
    const formData = new FormData();
    formData.append('refund_file_name', this.pfrefundscreen2.get('refund_file_name').value);
    formData.set('interest_chargeable_amount_1', this.pfrefundscreen2.get('interest_chargeable_amount_1').value);
    formData.set('interest_chargeable_amount_2', this.pfrefundscreen2.get('interest_chargeable_amount_2').value);
    formData.set('reg_branch_id', this.pfrefundscreen2.get('id').value);
    formData.set('refund_company_id', this.pfrefundscreen2.get('refund_company_id').value);
    formData.set('refund_processing_date', this.pfrefundscreen2.get('refund_processing_date').value);
    formData.set('refund_employee_cid', this.pfrefundscreen2.get('refund_employee_cid').value);
    formData.set('refund_employee_id', this.pfrefundscreen2.get('refund_employee_id').value);
    formData.set('refund_employee_contribution', this.pfrefundscreen2.get('refund_employee_contribution').value);
    formData.set('refund_employer_contribution', this.pfrefundscreen2.get('refund_employer_contribution').value);
    formData.set('refund_interest_on_employee_contr', this.pfrefundscreen2.get('refund_interest_on_employee_contr').value);
    formData.set('refund_interest_on_employer_contr', this.pfrefundscreen2.get('refund_interest_on_employer_contr').value);
    formData.set('refund_total_interest', this.pfrefundscreen2.get('refund_total_interest').value);
    formData.set('refund_total_disbursed_amount', this.pfrefundscreen2.get('refund_total_disbursed_amount').value);
    formData.set('refund_net_refundable', this.pfrefundscreen2.get('refund_net_refundable').value);
    formData.set('refund_as_on_interest_employee', this.pfrefundscreen2.get('refund_as_on_interest_employee').value);
    formData.set('refund_as_on_interest_employer', this.pfrefundscreen2.get('refund_as_on_interest_employer').value);
    formData.set('refund_total_contr', this.pfrefundscreen2.get('refund_total_contr').value);
    formData.set('refund_amount', this.pfrefundscreen2.get('refund_amount').value);
    formData.set('refund_remarks', this.pfrefundscreen2.get('refund_remarks').value);
    formData.set('pf_emp_acc_no', this.pfrefundscreen2.get('pf_emp_acc_no').value);
    this.isLoading = true;
    this.company.savePfRefund(formData).subscribe(res => {
      this.ngOnDestroy();
      this.isLoading = false;
      if (res['message']) {
        this.tosatr.error(res['message']);
      } else {
        this.tosatr.success(
          'Refund Process Successfully'
        );
        this.myModal1.hide();
        this.getApprovedOrPendingDataList();
      }

      // this.tosatr.success('Refund Submitted successfully');
    }, error => {
      console.log(error)
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  
  refundType = [
    { refundtype: 'PF-Refund', value: 'PF' },
    { refundtype: 'GF-Refund', value: 'GF' }
  ]


  changeGfCompanyName() {
    this.isLoading = true;
    this.company.getEmployeeNameByCompanyName().subscribe(res => {
      this.isLoading = false;
      this.companyname = res
    },error=>{
      this.isLoading = false;
    })
  }
 
  generateNotesheet(){
    this.isLoading = true;
    console.log(this.formarray.value.data)
    this.pfservice.generateNotesheet(this.formarray.value.data).subscribe(res => {
      console.log(res)
       if(res[0] == 'success'){
         this.viewNote = true;
         this.notesheet = res;
        this.tosatr.success(res['message']);
       }else{
        this.tosatr.success(res['message']);
       }
      this.isLoading = false;
    }, error => {
      this.viewNote = false;
      console.log(error)
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

 async viewNoteSheet(docPath){
    this.isLoading = true;
    await this.collection.downloadReport(docPath).subscribe(res => {
      this.isLoading = false;
      this.viewNote = true;
      console.log(res)
      let blob: any = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      open(url);
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get registerFormControl() {
    return this.pfrefundscreen1.controls;
  }
  get registerFormControl1() {
    return this.pfrefundscreen2.controls;
  }
}
