import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../_service/pf/pfservice.service';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-refundapprovedlist',
  templateUrl: './refundapprovedlist.component.html',
  styleUrls: ['./refundapprovedlist.component.scss']
})
export class RefundapprovedlistComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private tosatr: ToastrService,private fb: FormBuilder, private pfservice: PfserviceService, private masterBranch: UserService) { }
  approved
  approvedData:FormGroup
  ngOnInit(): void {
    this.RefundApprovedList()
    this.approvedpayment = true;
    this.checkAndCash();
    this. approvedFormData();
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
 async RefundApprovedList(){
  this.isLoading = true;
    await this.pfservice.getAllApprovedData().subscribe(res=>{
      this.isLoading = false;
      console.log(res)
      this.approved = res;
      this.dtTrigger.next();
     },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
     })
  }

  // -------------------payment----------

  productForm: FormGroup
  checkAndCash() {
    this.productForm = this.fb.group({
      paymentadvisenos: ['',[Validators.required]],
      payment_refund_ref_no: ['', [Validators.required]],
      reg_branch_id: ['', [Validators.required]],
      org_name: ['', [Validators.required]],
      accountTransactionMode: ['', [Validators.required]],
      accountVoucherAmount: ['', [Validators.required]],
      accountChequeDate: [''],
      accountCollectionInstrumentNo: [''],
      accountCollectionBank: [''],
      refundTableArray: this.fb.array([]),
    });
  }

  getRefundAdviseDetails() {
    this.pfservice.getRefundAdviseDetails().subscribe(res => {
      this.payment_advise_nos = res;
    })
  }
  refundableamt;
  org_name;
  reg_branch_id
  paymentdetails
  capability
  capacity
  transationalDetails
  ChangeRefunfAdviseNoDeposit(ref_no) {
    this.myModal.show();

    this.capability = true;
    this.getRefundAdviseDetails();
    this.getBranchName();
    console.log(ref_no)
    this.pfservice.ChangeRefunfAdviseNoDeposit(ref_no).subscribe(res => {
      console.log(res)
      this.paymentdetails = res[0].paymentdetails;
      this.capability = true;
      this.productForm = this.fb.group({
        paymentadvisenos: [res[0].total_payable_amount],
        payment_refund_ref_no: [res[0].total_payable_amount, [Validators.required]],
        payment_branch_id: [res[0].pfcompany_data.reg_branch_id, [Validators.required]],
        org_name: [res[0].pfcompany_data.org_name, [Validators.required]],
        accountTransactionMode: [''],
        accountVoucherAmount: ['', [Validators.required]],
        accountChequeDate: [''],
        accountCollectionInstrumentNo: [''],
        accountCollectionBank: [''],
        refundTableArray: this.fb.array(
          this.paymentdetails.map((datum) => this.generateDatumFormGroup(datum))
        ),
      });
      this.capacity = this.productForm.value.refundTableArray;
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })

  }
  getBranchName() {
    this.masterBranch.getBranchlist().subscribe(res => {
      console.log(res)
      this.branch_name = res
    })

  }
  editdata


  private generateDatumFormGroup(datum) {
    return this.fb.group({
      payment_advise_ref_no: this.fb.control({ value: datum.payment_advise_ref_no, disabled: false }),
      payment_contribution_amount: this.fb.control({ value: datum.payment_contribution_amount, disabled: false }),
      payment_dtl_company_id: this.fb.control({ value: datum.payment_dtl_company_id, disabled: false }),
      payment_employee_id: this.fb.control({ value: datum.payment_employee_id, disabled: false }),
      payment_interest_amount: this.fb.control({ value: datum.payment_interest_amount, disabled: false }),
      payment_refund_ref_no: this.fb.control({ value: datum.payment_refund_ref_no, disabled: false }),
      payment_total_amount: this.fb.control({ value: datum.payment_total_amount, disabled: false })
    });
  }
  
  collectionmode = [
    { collectionmodes: 'cash' },
    { collectionmodes: 'cheque' },
  ]

  cheque;
  changeCollection(event) {
    console.log(event.target.value)
    if (event.target.value === 'cash') {

      this.cheque = false

    }
    else if (event.target.value === 'cheque') {

      this.cheque = true
    }
  }

  payment_advise_nos;
  changeRefunfAdviseNo;
  branch_name;
  newCompletedRefund: FormGroup;
  approvedpayment
  SubmitRefund() {
    this.approvedpayment = false;
    this.myModal.hide()
    console.log(this.productForm.value)
   if(this.productForm.valid){
    this.pfservice.savePaymentRefund(this.productForm.value).subscribe(res => {
      this.productForm.reset(this.productForm.value);
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })

   }


  }
   //view approved refund function
   dataToApproved
   Supporting
   refundslipdocument
   employeeData
   companyData
   lastTransaction
   refund_approval_upload
   refund_advise_note
   leveldocument
   employeedata
   committee_approval
   allRefundData
   viewApprovedRefund(refundref_no){
     this.myModal.show()
     this.ToBeApprovedListByredunfRefNo(refundref_no)
   }

   process_upload;
   process_slip;
   allRefundDataApproval;
   onlyRefundadvise;
   processSlip
   allRefundApprovalData
   refundAdvideNote
   processUpload
   committeeApproval
   ToBeApprovedListByredunfRefNo(id) {
    this.isLoading = true;
    this.pfservice.refundApprovalListByRefundRefNo(id).subscribe(res => {
      this.isLoading = false;
      this.myModal.show()

      console.log(res)
      this.dataToApproved = res[0];

      this.employeeData = res[0].pf_refund_employee;
      this.companyData = res[0].company_details;
      this.lastTransaction = res[0].refund_transaction_data
      this.employeedata = false;
      if(res[0].pf_refund_employee === null) {
        this.employeedata = true;
      }
      if (res[0].refund_payment_advise_docs.length > 1) {
        this.allRefundApprovalData = true;
        this.refundAdvideNote = true;
         this.refund_approval_upload = res[0].refund_payment_advise_docs[0].doc_path;
         this.refund_advise_note = res[0].refund_payment_advise_docs[1].doc_path;
       }
       else if(res[0].refund_payment_advise_docs.length == 1){
        this.allRefundApprovalData = false;
        this.refundAdvideNote = true;
        this.refund_advise_note = res[0].refund_payment_advise_docs[0].doc_path;
       }
       if (res[0].refund_processed_upload_docs.length == 3) {
         this.processUpload =true;
         this.processSlip =true;
         this.committeeApproval =true;
        this.process_upload = res[0].refund_processed_upload_docs[0].doc_path;
        this.process_slip = res[0].refund_processed_upload_docs[1].doc_path;
        this.committee_approval = res[0].refund_processed_upload_docs[2].doc_path;
      }
      
       else if(res[0].refund_processed_upload_docs.length == 2) {
        this.processUpload =false;
         this.processSlip =true;
         this.committeeApproval =true;
        this.process_slip = res[0].refund_processed_upload_docs[0].doc_path;
        this.committee_approval = res[0].refund_processed_upload_docs[1].doc_path;
      }
      

      this.approvedData = this.fb.group({
        total_employee_contribution: new FormControl(this.employeedata?'':this.lastTransaction['total_employee_contribution']),
        total_employer_contribution: new FormControl(this.employeedata?'':this.lastTransaction['total_employer_contribution']),
        total_interest_on_employee_contribution: new FormControl(this.employeedata?'':Math.round(parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) * 100) / 100),
        total_interest_on_employer_contribution: new FormControl(this.employeedata?'':Math.round(parseFloat(this.lastTransaction['total_interest_on_employer_contribution']) * 100) / 100),

        total_contribution: new FormControl(this.employeedata?'':parseFloat(this.lastTransaction['total_employee_contribution']) + parseFloat(this.lastTransaction['total_employer_contribution'])),
        total_interest: new FormControl(this.employeedata?'':Math.round((parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        prev_total_disbursed_amount: new FormControl(this.employeedata?'':Math.round(parseFloat(this.lastTransaction['prev_total_disbursed_amount']) * 100) / 100),

        gross_refundable_amount: new FormControl(this.employeedata?'':Math.round((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) * 100) / 100),

        net_refundable_amount: new FormControl(this.employeedata?'':Math.round(((parseFloat(this.lastTransaction['total_employee_contribution']) +
          parseFloat(this.lastTransaction['total_employer_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employee_contribution']) +
          parseFloat(this.lastTransaction['total_interest_on_employer_contribution'])) -
          parseFloat(this.lastTransaction['prev_total_disbursed_amount'])) * 100) / 100),

        org_name: new FormControl(this.companyData['org_name']),
        employee_name: new FormControl(this.employeedata?'':this.employeeData['employee_name']),
        comp_acc_no: new FormControl(this.companyData['company_account_no']),
        emp_acc_no: new FormControl(this.employeedata?'':this.employeeData['pf_emp_acc_no']),
        refund_ref_no: new FormControl(this.dataToApproved['refund_ref_no']),
        reg_branch_id: new FormControl(this.dataToApproved['reg_branch_id'], [Validators.required]),
        refund_company_id: new FormControl(this.dataToApproved['pf_employee_company_id'], [Validators.required]),
        refund_processing_date: new FormControl(this.dataToApproved['refund_processing_date'], [Validators.required]),
        refund_employee_cid: new FormControl(this.employeedata?'':this.employeeData['identification_no'], [Validators.required]),
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
      })

    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  cancelTimes(){
    this.myModal.hide();
    this.approvedData.reset(this.approvedData);
  }

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

          open(url, path)
        
      }, error => {
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }

  }

  selectedSimpleItem = []

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.org_name.toLocaleLowerCase().indexOf(term) > -1 || item.company_account_no.toLocaleLowerCase().indexOf(term) > -1;
  }

}
