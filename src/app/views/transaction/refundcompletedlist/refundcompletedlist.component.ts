import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../_service/pf/pfservice.service';

@Component({
  selector: 'app-refundcompletedlist',
  templateUrl: './refundcompletedlist.component.html',
  styleUrls: ['./refundcompletedlist.component.scss']
})
export class RefundcompletedlistComponent implements OnInit {
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  dtTrigger: Subject<any> = new Subject<any>();
  refundcompleted
  @ViewChild('myModal') public myModal: ModalDirective;
  employeeData: any;
  companyData: any;
  lastTransaction: any;
  employeedata: boolean;
  allRefundApprovalData: boolean;
  refundAdvideNote: boolean;
  refund_approval_upload: any;
  refund_advise_note: any;
  processUpload: boolean;
  committeeApproval: boolean;
  processSlip: boolean;
  process_upload: any;
  process_slip: any;
  committee_approval: any;
  approvedData: any;
  completedRefundFormGroup: FormGroup;
  leveldocument = false;
  constructor(private tosatr: ToastrService,private pfservice:PfserviceService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.viewCompletedDataList()
    this.isLoading = true;
    this.pfservice.refundCompletedList().subscribe(res=>{
      this.isLoading = false;
      console.log(res)
     this.refundcompleted = res;
     this.dtTrigger.next();
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  
  }
  viewCompletedDataList(){
    this.completedRefundFormGroup = this.fb.group({
      org_name:new FormControl(''),
      company_account_no: new FormControl(''),
      license_no: new FormControl(''),
      org_type: new FormControl(''),
      refund_approved_by: new FormControl(''),
      refund_employee_cid: new FormControl(''),
      refund_employee_contribution: new FormControl(''),
      refund_employer_contribution: new FormControl(''),
      refund_net_refundable: new FormControl(''),
      refund_processed_by:new FormControl(''),
      refund_processing_date: new FormControl(''),
      refund_total_contr: new FormControl(''),
      refund_total_disbursed_amount: new FormControl(''),
      refund_total_interest: new FormControl(''),
      refund_verified_by: new FormControl(''),
      refund_verified_date: new FormControl(''),
      registration_type: new FormControl(''),
      branch_name: new FormControl(''),
      employee_name: new FormControl(''),
      employee_id_no: new FormControl(''),
      identification_no: new FormControl(''),
      employee_contribution_amount: new FormControl(''),
      employer_contribution_amount: new FormControl(''),      
      address: new FormControl(''),
      basic_pay: new FormControl(''),
      contribution: new FormControl(''),
      payment_process_date: new FormControl(''),
      payment_status: new FormControl(''),
      total_payable_amount: new FormControl(''),
      refund_payment_remarks: new FormControl(''),
      refund_processed_remarks : new FormControl(''),
      refund_verified_remarks :  new FormControl('')

    });
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
  dataToApproved
  refund_payment_voucher
  paymentVoucher
  ViewCompletedRefundData(refNo) {
    this.pfservice.viewCompletedDataList(refNo).subscribe(res=>{
      console.log(res)
      this.isLoading = false;
      if (res['refund_payment_advise_docs'].length == 2) {
        this.allRefundApprovalData = true;
        this.refundAdvideNote = true;
        this.paymentVoucher = false;
         this.refund_approval_upload = res.refund_payment_advise_docs[0].doc_path;
         this.refund_advise_note = res.refund_payment_advise_docs[1].doc_path;
       }
       else if(res['refund_payment_advise_docs'].length == 0){
        this.allRefundApprovalData = false;
        this.refundAdvideNote = false;
        this.paymentVoucher = false;
        this.refund_payment_voucher = false;
        this.refund_approval_upload = false;
        this.refund_advise_note = false;
       }
      else if (res['refund_payment_advise_docs'].length == 3) {
        this.allRefundApprovalData = true;
        this.refundAdvideNote = true;
        this.paymentVoucher = true;
        this.refund_payment_voucher = res.refund_payment_advise_docs[2].doc_path;
         this.refund_approval_upload = res.refund_payment_advise_docs[0].doc_path;
         this.refund_advise_note = res.refund_payment_advise_docs[1].doc_path;
       }
       else if(res['refund_payment_advise_docs'].length == 1){
        this.allRefundApprovalData = false;
        this.refundAdvideNote = true;
        this.refund_advise_note = res.refund_payment_advise_docs[0].doc_path;
       }
      else if (res['refund_processed_upload_docs'].length == 3) {
         this.processUpload =true;
         this.processSlip =true;
         this.committeeApproval =true;
        this.process_upload = res['refund_processed_upload_docs'][0].doc_path;
        this.process_slip = res['refund_processed_upload_docs'][1].doc_path;
        this.committee_approval = res['refund_processed_upload_docs'][2].doc_path;
      }
      
       else if(res['refund_processed_upload_docs'].length == 2) {
        this.processUpload =false;
         this.processSlip =true;
         this.committeeApproval =true;
        this.process_slip = res.refund_processed_upload_docs[0].doc_path;
        this.committee_approval = res.refund_processed_upload_docs[1].doc_path;
      }

      this.completedRefundFormGroup = this.fb.group({
        org_name:new FormControl(res['org_name']),
        company_account_no: new FormControl(res['company_account_no']),
        license_no: new FormControl(res['license_no']),
        org_type: new FormControl(res['org_type']),
        refund_approved_by: new FormControl(res['refund_approved_by']),
        refund_employee_cid: new FormControl(res['refund_employee_cid']),
        refund_employee_contribution: new FormControl(res['refund_employee_contribution']),
        refund_employer_contribution: new FormControl(res['refund_employer_contribution']),
        refund_net_refundable: new FormControl(res['refund_net_refundable']),
        refund_processed_by:new FormControl(res['refund_processed_by']),
        refund_processing_date: new FormControl(res['refund_processing_date']),
        refund_total_contr: new FormControl(res['refund_total_contr']),
        refund_total_disbursed_amount: new FormControl(res['refund_total_disbursed_amount']),
        refund_total_interest: new FormControl(res['refund_total_interest']),
        refund_verified_by: new FormControl(res['refund_verified_by']),
        refund_verified_date: new FormControl(res['refund_verified_date']),
        registration_type: new FormControl(res['registration_type']),
        branch_name: new FormControl(res['branch_name']),
        employee_name: new FormControl(res['getemployeedata'][0].employee_name),
        employee_id_no: new FormControl(res['getemployeedata'][0].employee_id_no),
        identification_no: new FormControl(res['getemployeedata'][0].identification_no),
        employee_contribution_amount: new FormControl(res['getemployeedata'][0].employee_contribution_amount),
        employer_contribution_amount: new FormControl(res['getemployeedata'][0].employer_contribution_amount),      
        address: new FormControl(res['getemployeedata'][0].address),
        basic_pay: new FormControl(res['getemployeedata'][0].basic_pay),
        contribution: new FormControl(res['getemployeedata'][0].contribution),
        payment_process_date: new FormControl(res['refund_payments_data'][0].payment_process_date),
        payment_status: new FormControl(res['refund_payments_data'][0].payment_status),
        total_payable_amount: new FormControl(res['refund_payments_data'][0].total_payable_amount),
        refund_payment_remarks: new FormControl(res['refund_payment_remarks']),
        refund_processed_remarks : new FormControl(res['refund_processed_remarks']),
        refund_verified_remarks :  new FormControl(res['refund_verified_remarks'])
      });
      this.myModal.show()
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })

  }
}
