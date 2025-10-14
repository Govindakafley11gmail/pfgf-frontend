import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CompanyService } from '../../_service/GF-API/company.service';
import { PfserviceService } from '../../_service/pf/pfservice.service';
import { PfemployeeService } from '../../_service/pfemployee/pfemployee.service';
import { UserService } from '../../_service/user.service';
import {saveAs} from 'file-saver';
import { CollectionService } from '../../_service/collection/collection.service';

@Component({
  selector: 'app-refundpendingprocess',
  templateUrl: './refundpendingprocess.component.html',
  styleUrls: ['./refundpendingprocess.component.scss']
})
export class RefundpendingprocessComponent implements OnInit, OnDestroy {
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
  isProcessGf:boolean = false;
  ngOnInit(): void {
    this.approved = true;
    this.getApprovedOrPendingDataList();
    this.approvependingData();
    this.approvedFormData();
    this.pfrefundFormControlScreen2();
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
      net_refundable_amount: new FormControl(''),
      employee_contribution: new FormControl(''),
      employer_contribution: new FormControl(''),
      employee_identification_no: new FormControl(''),
      reference_no: new FormControl(''),
      reference_date: new FormControl(''),

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
        employee_contribution: new FormControl(''),
        employer_contribution: new FormControl(''),
        reference_no: new FormControl(''),
        reference_date: new FormControl(''),
      });
      this.listpermission()

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

        if (['png', 'jpeg', 'jpg'].includes(path.split('.').pop())) {
          let blob: any = new Blob([res], { type: 'image/' + path.split('.').pop() });
          const url = window.URL.createObjectURL(blob);
          open(url, path);
        }

        else if (['xlsx', 'csv'].includes(path.split('.').pop())) {
          let blob: any = new Blob([res], { type: 'text/' + path.split('.').pop() });
          const url = window.URL.createObjectURL(blob);
          open(url, path);

        } else {
          let blob: any = new Blob([res], { type: 'application/' + path.split('.').pop() });
          const url = window.URL.createObjectURL(blob);

          open(url, path);
        }
      }, error => {
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }

  }

  getApprovedOrPendingDataList() {
    this.isLoading = true;
    this.pfservice.getRefundDetails().subscribe(res => {
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
  verifyRefunds;
  userRefundNote
// console.log(this.arrayPermissionarrayPermission)
 listPermission = []
  listpermission(){
    this.master.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'verify-refund'){
          this.verifyRefunds = true;
          console.log(this.listPermission[j])
        }else if(this.listPermission[j] == 'refund-process'){
          this.userRefundCreate = true;
          console.log(this.listPermission[j])
        }else if(this.listPermission[j] == 'reverse-collection') {
          this.userRefundNote = true;
        }
      }
    })
  }

  selectPendingFile(event) {

    if (event.target.files[0]) {
      const files = <File>event.target.files[0];
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
   console.log(this.formarray.value.approve_file_name.length)

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

    console.log(this.formarray.value.data)
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
    console.log(this.formarray.value.data)
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

  verifyRefund() {

    if (this.approvedData.value.registration_type == 'PF') {
      this.verifyPFrefund();
    } else {
      this.verifyGFrefund();
    }

  }

  verifyPFrefund() {
    this.isLoading = true;
    this.pfservice.verifyRefund(this.approvedData.value.refund_ref_no).subscribe(res => {
      this.isLoading = false;
      if (res[0] != 'success') {
        this.tosatr.error(res['message']);
      } else {
        this.tosatr.success(res['message']);
        this.getApprovedOrPendingDataList();
        this.myModals.hide();
        this.myModal.hide();

      }
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  verifyGFrefund() {
    this.isLoading = true;
    this.company.verifyRefund(this.approvedData.value.refund_ref_no).subscribe(res => {
      this.isLoading = false;
      if (res[0] != 'success') {
        this.tosatr.error(res['message']);
      } else {
        this.tosatr.success(res['message']);
        this.getApprovedOrPendingDataList();
        this.myModals.hide();
        this.myModal.hide();

      }
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
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
  createNewPfRefund() {
    this.toggle = false;
    this.refundShow = true;
    this.refundShowScreen2 = false;
    this.getByBranchName();
    this.pfrefundFormControlScreen1();
    this.toggle = false;
    this.toggles = false;
    this.toggless = false;

    this.toggles1 = true
    this.approverefund = false
    this.myModal1.show()
  }
  pfrefundFormControlScreen1() {
    this.pfrefundscreen1 = this.fb.group({
      refundType: new FormControl('', Validators.required),
      org_names: new FormControl(''),
      employee_name: new FormControl(''),
      processingdate: new FormControl(''),
      pf_employee_id: new FormControl(''),
      identification_no: new FormControl('')
    })

  }
  pfrefundFormControlScreen2() {
    this.pfrefundscreen2 = this.fb.group({
      org_name: new FormControl('', Validators.required),
      employee_name: new FormControl('', Validators.required),
      comp_acc_no: new FormControl('', Validators.required),
      emp_acc_no: new FormControl('', Validators.required),
      processing_date: new FormControl('', Validators.required),
      total_cont: new FormControl('', Validators.required),
      as_on_intreast: new FormControl('', Validators.required),
      total_intreast: new FormControl('', Validators.required),
      total_dist_amt: new FormControl('', Validators.required),
      net_refundable: new FormControl('', Validators.required),
      refund_file_name: new FormControl(''),
      pf_emp_acc_no : new FormControl('',Validators.required),
      employee_contribution: new FormControl('',Validators.required),
      employer_contribution: new FormControl('',Validators.required),
      bank_name: new FormControl('',Validators.required),
       employee_identification_no: new FormControl(''),
      reference_no: new FormControl(''),
      reference_date: new FormControl(''),
    })
  }
  getByBranchName() {
    this.master.getBranchlist().subscribe(res => {
      this.branch_names = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  processingDate(e) {
    this.processing_date = e.target.value;
    this.pfrefundscreen1.patchValue({
      processingdate: e.target.value
    })
  }

  getEmployeeList() {
    console.log(this.pfrefundscreen1.value)
    this.pfservice.getActiveEmployeeByCompId(this.comp_name).subscribe(res => {
      this.employeeName = res;
      console.log(res)
    })
  }

  getEmployeeDetails() {

    this.pfservice.getpfEmployeeById(this.employee_id).subscribe(res => {
      this.employee_cid = res;
      // console.log(res)

      let row2 = this.pfrefundscreen1.get('pf_employee_id');
      let row3 = this.pfrefundscreen1.get('identification_no');
      row3.patchValue(res['identification_no']);
      row2.patchValue(res['pf_employee_id']);
      console.log(this.pfrefundscreen1.value)
    })

  }

  processPffund() {
    this.submitted = true;
    console.log(this.pfrefundscreen1.value)
    if (this.pfrefundscreen1.invalid) {
      return;
    }

    else {

      if (this.pfrefundscreen1.value.refundType == 'PF') {
      this.pfProcess()

      } else {
        this.gfProcess()
      }
    }
  }
  isDisabled
  pfRefund
  pfProcess() {
    console.log(this.pfrefundscreen1.value.pf_employee_id)
    this.isLoading = true;
    this.pfservice.getrefundbyemployeeid(this.pfrefundscreen1.value.pf_employee_id).subscribe(res => {
       this.isProcessGf =false;
      this.isLoading = false;
      this.process = true;
      this.pfRefund = true;
      this.isDisabled = true;
      console.log(res)
      this.totaldistributionAmt = res['pfemployee'].pfdisbursement
      if (this.totaldistributionAmt == null || this.totaldistributionAmt == '') {
        this.totalDisAmt = 0
      } else {
        this.totalDisAmt = this.totaldistributionAmt[0].refund_total_disbursed_amount
      }

      this.pfcontributions = res['pfemployee'].pfcontribution[0]
      this.refundCollection = res['pfemployee'];

      this.lastTransactionData = res['pfemployee'].last_transaction_data;

      if (this.lastTransactionData.length == 0) {
        this.tosatr.warning(' You cannot process your refund before closing!');
        return;
      } else {
        this.previousDate = new Date(this.lastTransactionData.transaction_date);
        this.currentDate = new Date(this.processing_date)
        this.noOfDays = this.currentDate - this.previousDate;

        const diffInMs = (this.currentDate - this.previousDate)
        const dateDiff = diffInMs / (1000 * 60 * 60 * 24);

        if (dateDiff >= 0) {
          this.asOnDateEmployeeInterest = this.lastTransactionData.interest_chargeable_amount_1 *  res['pfemployee'].interest_rate/ 100 * dateDiff / 365;
          this.asOnDateEmployerInterest = this.lastTransactionData.interest_chargeable_amount_2 * res['pfemployee'].interest_rate / 100 * dateDiff / 365;
    
        } else {
          this.screen1();
          this.processing_message = "You Cannot process The Refund, Date is incorrect"
        }

        this.employee_data = this.refundCollection['employee_contribution_amount'];
        this.org_name = res['companyname'][0].org_name;
        this.employee_name = this.refundCollection['employee_name']
        this.comp_acc_no = res['companyname'][0].company_account_no;
        this.emp_acc_no = this.refundCollection['pf_emp_acc_no']
        this.pfemployee_id = this.refundCollection['identification_no']
        
        this.pfrefundscreen2 = this.fb.group({
          registration_type: new FormControl(res['pfemployee'].registration_type),
          interest_chargeable_amount_1: [this.lastTransactionData['interest_chargeable_amount_1']],
          interest_chargeable_amount_2: [this.lastTransactionData['interest_chargeable_amount_2']],
          id: ['', [Validators.required]],
          refund_company_id: [this.refundCollection['pf_employee_company_id'], [Validators.required]],
          refund_processing_date: [this.processing_date, [Validators.required]],
          refund_employee_cid: [this.refundCollection['identification_no'], [Validators.required]],
          refund_employee_id: [this.refundCollection['pf_employee_id'], [Validators.required]],
          refund_employee_contribution: [this.lastTransactionData['total_employee_contribution'], [Validators.required]],
          refund_employer_contribution: [this.lastTransactionData['total_employer_contribution'], [Validators.required]],
          refund_interest_on_employee_contr: [Math.round(parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) * 100) / 100, [Validators.required]],
          refund_interest_on_employer_contr: [Math.round(parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) * 100) / 100, [Validators.required]],
          refund_total_contr: [parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']), [Validators.required]],
          refund_as_on_interest_employee: [Math.round(parseFloat(this.asOnDateEmployeeInterest) * 100) / 100, [Validators.required]],
          refund_as_on_interest_employer: [Math.round(parseFloat(this.asOnDateEmployerInterest) * 100) / 100, [Validators.required]],
          refund_total_interest: [Math.round((parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest) * 100) / 100, [Validators.required]],
          refund_total_disbursed_amount: [Math.round(parseFloat(this.totalDisAmt) * 100) / 100, Validators.required],
          refund_net_refundable: [Math.round((parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest - this.totalDisAmt) * 100) / 100, [Validators.required]],
          refund_file_name: new FormControl('',[Validators.required]),
           employee_identification_no: new FormControl(''),
          
          refund_emplyee_contrib: new FormControl((parseFloat(this.lastTransactionData['total_employee_contribution'])+parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.asOnDateEmployeeInterest)).toFixed(2),Validators.required),
          refund_emplyr_contrib: new FormControl((parseFloat(this.lastTransactionData['total_employer_contribution'])+parseFloat(this.lastTransactionData['total_interest_on_employer_contribution'])+ parseFloat(this.asOnDateEmployerInterest)).toFixed(2),Validators.required),
          bank_name: new FormControl('',Validators.required),
          refund_remarks: [
            '1. Nu.............., in favor of........................., Bank Account No......................, Bank Name:..................'+'\n'+
          '2. Nu................, in favor of........................., Bank Account No......................, Bank Name:..................'],
          pf_emp_acc_no: new FormControl('',Validators.required),
          refund_amount: [Math.round((parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest - this.totalDisAmt) * 100) / 100],
          reference_no: new FormControl('',Validators.required),
          reference_date: new FormControl('',Validators.required),
        })
      }
      this.screen2()
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })

  }
  isSuportingDocument = false;
  gfProcess() {
    console.log(this.pfrefundscreen1.value)
    this.isLoading = true;
    this.company.getrefundbyemployeeid(this.pfrefundscreen1.value.pf_employee_id).subscribe(res => {
      console.log(res)
      this.isProcessGf =true;
      this.isLoading = false;
      this.process = true;
      this.pfRefund = false;
     this.isDisabled = false;
      this.totaldistributionAmt = res[0].gfdisbursement
      if (this.totaldistributionAmt == null || this.totaldistributionAmt == '') {
        this.totalDisAmt = 0
      } else {
        this.totalDisAmt = this.totaldistributionAmt[0].refund_total_disbursed_amount
      }

      this.pfcontributions = res[0].gfdisbursement[0]
      this.refundCollection = res[0];

      this.lastTransactionData = res[0].gf_last_transaction_data;
      console.log("last", this.lastTransactionData)
      if (this.lastTransactionData == null || this.lastTransactionData == '') {
        this.tosatr.warning(' You cannot process your refund before closing!');
        return;
      } else {
        this.previousDate = new Date(this.lastTransactionData.transaction_date);
        this.currentDate = new Date(this.processing_date)
        this.noOfDays = this.currentDate - this.previousDate;

        const diffInMs = (this.currentDate - this.previousDate)
        const dateDiff = diffInMs / (1000 * 60 * 60 * 24);
        console.log(dateDiff)

        if (dateDiff >= 0) {
          this.asOnDateEmployeeInterest = this.lastTransactionData.interest_chargeable_amount_1 * res[0]['interest_rate'] / 100 * dateDiff / 365;
          this.asOnDateEmployerInterest = this.lastTransactionData.interest_chargeable_amount_2 * res[0]['interest_rate'] / 100 * dateDiff / 365;
          console.log(this.asOnDateEmployeeInterest,this.asOnDateEmployerInterest)
        } else {
          this.screen1()
          this.processing_message = "You Cannot process The Refund, Date is incorrect"
        }

        this.employee_data = this.refundCollection['employee_contribution_amount'];
        this.org_name = this.refundCollection['org_name']
        this.employee_name = this.refundCollection['employee_name']
        this.comp_acc_no = this.refundCollection['company_account_no']
        this.emp_acc_no = this.refundCollection['pf_emp_acc_no']
        this.pfemployee_id = this.refundCollection['identification_no']

        this.pfrefundscreen2 = this.fb.group({
          registration_type: new FormControl(res[0]['registration_type']),
          interest_chargeable_amount_1: [this.lastTransactionData['interest_chargeable_amount_1']],
          interest_chargeable_amount_2: [this.lastTransactionData['interest_chargeable_amount_2']],
          id: ['', [Validators.required]],
          refund_company_id: [this.refundCollection['pf_employee_company_id'], [Validators.required]],
          refund_processing_date: [this.processing_date, [Validators.required]],
          refund_employee_cid: [this.refundCollection['identification_no'], [Validators.required]],
          refund_employee_id: [this.refundCollection['pf_employee_id'], [Validators.required]],
          refund_employee_contribution: [this.lastTransactionData['total_employee_contribution'], [Validators.required]],
          refund_employer_contribution: [this.lastTransactionData['total_employer_contribution'], [Validators.required]],
          refund_interest_on_employee_contr: [Math.round(parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) * 100) / 100, [Validators.required]],
          refund_interest_on_employer_contr: [Math.round(parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) * 100) / 100, [Validators.required]],
          refund_total_contr: [parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']), [Validators.required]],
          refund_as_on_interest_employee: new FormControl((parseFloat(this.asOnDateEmployeeInterest)).toFixed(2), [Validators.required]),
          refund_as_on_interest_employer: new FormControl((parseFloat(this.asOnDateEmployerInterest)).toFixed(2), [Validators.required]),
          refund_total_interest: [Math.round((parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest) * 100) / 100, [Validators.required]],
          refund_total_disbursed_amount: [Math.round(parseFloat(this.totalDisAmt) * 100) / 100, Validators.required],
          refund_net_refundable: [Math.round((parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest - this.totalDisAmt) * 100) / 100, [Validators.required]],
          refund_file_name: new FormControl('',[Validators.required]),
          refund_emplyee_contrib: new FormControl((parseFloat(this.lastTransactionData['total_employee_contribution'])+parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.asOnDateEmployeeInterest)).toFixed(2),Validators.required),
          refund_emplyr_contrib: new FormControl((parseFloat(this.lastTransactionData['total_employer_contribution'])+parseFloat(this.lastTransactionData['total_interest_on_employer_contribution'])+ parseFloat(this.asOnDateEmployerInterest)).toFixed(2),Validators.required),
          bank_name: new FormControl('',Validators.required),
          employee_identification_no: new FormControl(''),
          refund_remarks: [
            '1. Nu.............., in favor of........................., Bank Account No......................, Bank Name:..................'+'\n'+
          '2. Nu................, in favor of........................., Bank Account No......................, Bank Name:..................'],
          pf_emp_acc_no: new FormControl(''),
          refund_amount: [Math.round((parseFloat(this.lastTransactionData['total_employee_contribution']) + parseFloat(this.lastTransactionData['total_employer_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employee_contribution']) + parseFloat(this.lastTransactionData['total_interest_on_employer_contribution']) + this.asOnDateEmployeeInterest + this.asOnDateEmployerInterest - this.totalDisAmt) * 100) / 100]
          ,reference_no: new FormControl('',Validators.required),
          reference_date: new FormControl('',Validators.required),
        })
        console.log(  this.pfrefundscreen2.value.registration_type, this.pfrefundscreen2.value.interest_chargeable_amount_1)
        this.screen2()
      }
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  screen1() {
    this.refundShow = true;
    this.process = false;
    this.toggle = false;
    this.toggles = true;
    this.refundShow = true;
    this.refundShowScreen2 = false;
  }

  screen2() {
    if (this.process) {
      this.toggle = true;
      this.toggles = false;
      this.refundShow = false;
      this.refundShowScreen2 = true;

    } else {
      this.tosatr.warning('Cannot Navigate Before Processing !');
    }
  }

  changeCompanyName() {
    this.isLoading = true;
    this.pfservice.getEmployeeNameByCompanyName().subscribe(res => {
      this.isLoading = false;
      this.companyname = res
      console.log(res)
    })
  }
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
    if (this.pfrefundscreen2.invalid ) {
      
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
    formData.set('refund_emplyee_contrib', this.pfrefundscreen2.get('refund_emplyee_contrib').value);
    formData.set('refund_emplyr_contrib', this.pfrefundscreen2.get('refund_emplyr_contrib').value);
    formData.set('bank_name', this.pfrefundscreen2.get('bank_name').value);
    formData.set('employee_identification_no', this.pfrefundscreen2.get('employee_identification_no').value);
    formData.set('reference_no', this.pfrefundscreen2.get('reference_no').value);
    formData.set('reference_date', this.pfrefundscreen2.get('reference_date').value);
    this.isLoading = true;
    
    this.pfservice.savePfRefund(formData).subscribe(res => {
      
      this.isLoading = false;
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
    formData.set('bank_name', this.pfrefundscreen2.get('bank_name').value);
    formData.set('refund_emplyee_contrib', this.pfrefundscreen2.get('refund_emplyee_contrib').value);
    formData.set('refund_emplyr_contrib', this.pfrefundscreen2.get('refund_emplyr_contrib').value);
    formData.set('employee_identification_no', this.pfrefundscreen2.get('employee_identification_no').value);
    formData.set('reference_no', this.pfrefundscreen2.get('reference_no').value);
    formData.set('reference_date', this.pfrefundscreen2.get('reference_date').value);

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
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  refundType = [
    { refundtype: 'PF-Refund', value: 'PF' },
    { refundtype: 'GF-Refund', value: 'GF' }
  ]

  changeRefundType() {
    if (this.pfrefundscreen1.value.refundType == 'PF') {
      this.changeCompanyName();
    } else {
      this.changeGfCompanyName();
    }
  }

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
    this.pfservice.generateNotesheet(this.formarray.value.data).subscribe(res => {
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
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

 async viewNoteSheet(docPath){
    this.isLoading = true;
    await this.collection.downloadReport(docPath).subscribe(res => {
      this.isLoading = false;
      this.viewNote = true;
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


