import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../_service/pf/pfservice.service';

@Component({
  selector: 'app-payment-approved',
  templateUrl: './payment-approved.component.html',
  styleUrls: ['./payment-approved.component.scss']
})
export class PaymentApprovedComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  paymentapproved;
  refundSetteled;
  isCheckedRefundSetteled = false;
  arrayEmployeeRefundSetteled;
  arrayEmployeeRefundExcessSetteled
  completedRefundFormGroup:FormGroup;
  @ViewChild('myModal') public myModal: ModalDirective;
  constructor(private pfservice: PfserviceService,private tosatr: ToastrService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.getAllApprovedPayment();
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
  getAllApprovedPayment() {
    this.isLoading = true;
     this.pfservice.getAllsettledPayment().subscribe(res=>{
      this.isLoading = false;
      
       this.paymentapproved = res;
       this.dtTrigger.next();
     },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
     })
  }
  
 async onPressRefundSetteled(company_id){
     this.isLoading = true;
   await  this.pfservice.getAllApprovedPayment(company_id).subscribe(res=>{
      this.isLoading = false;
      this.isCheckedRefundSetteled = true;
      this.myModal.show();
       this.refundSetteled = res[0];
       this.arrayEmployeeRefundSetteled = res[1].get_employee_details;
       this.arrayEmployeeRefundExcessSetteled = res[0].organization_payment_detail;
     },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
     })
  };

  downloadPaymentVoucher(path) {
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

  viewRefundSetteled(paymentAdviseNo){
    this.pfservice.getbyPaymentAdviseNo(paymentAdviseNo).subscribe(res=>{
      console.log(res[0].company_payments.paymentdetails[0].payment_document[0].doc_path )
      this. downloadPaymentVoucher(res[0].company_payments.paymentdetails[0].payment_document[0].doc_path)
     },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
     })
  }
}
