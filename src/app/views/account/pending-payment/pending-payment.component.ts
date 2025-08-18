import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../_service/pf/pfservice.service';
import {UserService} from '../../_service/user.service';
import {CollectionService} from '../../_service/collection/collection.service';
import {ToastrService} from 'ngx-toastr';
import { DataTableDirective } from "angular-datatables";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-pending-payment',
  templateUrl: './pending-payment.component.html',
  styleUrls: ['./pending-payment.component.scss']
})
export class PendingPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  datatableElement: any = DataTableDirective;
displayedColumns: string[] = ['slNo', 'adviseNo', 'orgName', 'totalPayable', 'orgAccount', 'branch', 'status', 'regType', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  paymentProcess: boolean = true; // Example flag
  pendingPayments: any; // Your data array

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private tosatr: ToastrService, private pfservice: PfserviceService, private fb: FormBuilder, private masterBranch: UserService, private collection: CollectionService) { }
  productForms: FormGroup
  pendingPayment
  payment_advise_nos
  branch_name
  refundableamt;
  org_name;
  reg_branch_id
  paymentdetails
  capability
  capacity
  transationalDetails
  paymentshow;
  getaccounttype
  getaccounttypes
  ngOnInit(): void {
    this.paymentshow = false
    this.pendingpayment()
    this.isLoading = true;
    this.productForms = this.fb.group({
      refund_net_refundable: new FormControl(''),
      refund_remaining_amount: new FormControl(''),
      payment_refund_ref_no: new FormControl(''),
      org_name: new FormControl(),
      payment_bank_account_data: new FormControl('', Validators.required),
      payment_date: new FormControl('', Validators.required),
      accountVoucherAmount: new FormControl(''),
      payment_advise_no: new FormControl('', [Validators.required]),
      payment_branch_id: new FormControl('', [Validators.required]),
      total_payable_amount: new FormControl('', [Validators.required]),
      payment_mode: new FormControl('', Validators.required),
      instrument_date: new FormControl('', Validators.required),
      instrumentNo: new FormControl('', Validators.required),
      payment_bank_name: new FormControl('', Validators.required),
      refund_payment_remarks: new FormControl(''),
      pf_emp_acc_no: new FormControl(''),
      payment_dtl_company_id:new FormControl(''),
      refundTransactionCategory: this.fb.array(
        []
      ),
    });
  }

  myModelHide(){
    this.myModal.hide();
    this.productForms.reset();
  }

  SubmitRefund() {
    console.log(this.productForms.value)
   if(this.productForms.invalid){
    this.submitted = true;
    return;
   }  this.isLoading = true;
   this.submitRefund = true;
   if(this.productForms.value.refundTransactionCategory.length != 0){
    this.pfservice.savePaymentRefund(this.productForms.value).subscribe(res => {
      this.submitRefund = false;
      this.isLoading = false;
      this.tosatr.success(res)
      this.approvedpayment = false;
      this.productForms.reset();
      this.myModal.hide()
      this.productForms.reset(this.productForms.value);
      this.pendingpayment();
    }, error => {
      this.submitRefund = false;
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }else{
    this.pfservice.savePaymentExcessRefund(this.productForms.value).subscribe(res => {
      this.submitRefund = false;
      this.isLoading = false;
      this.tosatr.success(res)
      this.approvedpayment = false;
      this.productForms.reset();
      this.myModal.hide()
      this.productForms.reset(this.productForms.value);
      this.pendingpayment();
    }, error => {
      this.submitRefund = false;
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  }
  isLoading
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

  private pendingpayment = async () => {
    this.isLoading = true;

    await this.pfservice.pendingPament().subscribe(res => {
      this.isLoading = false;
      this.pendingPayments = res;
      this.dataSource.data = this.pendingPayments; 
      // this.listpermission();
      this.dtTrigger.next();
      this.ngOnDestroy()
    }, error => {
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  
  listPermission = []
  listpermission(){
    this.masterBranch.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
  
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'refund-payments'){
          console.log(this.listPermission[j])
          this.paymentProcess = true;
          
        }
      }
    })
  }
  Payment = (id) => {
    this.paymentshow = true;
    this.myModal.show();
    this.ChangeRefunfAdviseNoDeposit(id)
    this.capability = true;
    this.getBranchName();

  }

  async getRefundAdviseDetails() {
    await this.pfservice.getRefundAdviseDetails().subscribe(res => {
      this.payment_advise_nos = res;
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  payment_advise_no
  total_payable_amount
  id
  org_names
  Totalcontribution
  totalInterest
  totalpayable
  approvalUpload
  approvalNote
  approvalUploaddoc
  approvalNotedoc
  paymentdetail
  refundTotalAmount = 0;
  private ChangeRefunfAdviseNoDeposit = async (id) => {
    this.paymentshow = true;
    this.isLoading = true;
    await this.pfservice.ChangeRefunfAdviseNoDeposit(id).subscribe(res => {

      this.Totalcontribution = 0
      this.totalInterest = 0
      this.totalpayable = 0
      this.capability = true;
      this.isLoading = false;
      this.org_name = res[0].pfcompany_data['org_name'];
      this.paymentdetail = false;
      if(res[0].paymentdetails.length == 0){
        this.paymentdetail = true;
      }
      if(res[0].refund_approval_doc.length > 1){
        this.approvalUploaddoc = true
        this.approvalNotedoc = true
        this.approvalUpload =res[0].refund_approval_doc[0].doc_path
        this.approvalNote =res[0].refund_approval_doc[1].doc_path
      }
      else if (res[0].refund_approval_doc.length == 0) {

        this.approvalUploaddoc = false
        this.approvalNotedoc = false
      }
      // 17994025
      else{
        this.approvalNotedoc = true
        this.approvalUploaddoc = false
        this.approvalNote =res[0].refund_approval_doc[0].doc_path
      }
      for(let i=0;i<res[0].paymentdetails.length;i++) {
        this.refundTotalAmount += parseFloat(res[0].paymentdetails[i].payment_refund_details[0].refund_net_refundable);
      }

      this.productForms = this.fb.group({
        registration_type: new FormControl(res[0].registration_type),
        refund_remaining_amount: new FormControl(this.paymentdetail?'':((this.refundTotalAmount)-(parseFloat(res[0]["total_payable_amount"]))).toFixed(2)),
        refund_net_refundable: new FormControl(this.paymentdetail?'':(this.refundTotalAmount).toFixed(2)),
        payment_refund_ref_no: [this.paymentdetail? "" :res[0].paymentdetails[0].payment_refund_ref_no],
        org_name: new FormControl(this.org_name),
        payment_dtl_company_id:new FormControl(res[0].payment_company_id),
        pf_emp_acc_no: new FormControl(res[0].paymentdetails.length==0 ? '': res[0].paymentdetails[0]['pf_emp_acc_no'] ),
        payment_bank_account_data: new FormControl('', Validators.required),
        payment_date: new FormControl('', Validators.required),
        accountVoucherAmount: new FormControl((parseFloat(res[0]["total_payable_amount"])).toFixed(2)),
        payment_advise_no: new FormControl(res[0]['payment_advise_no'], [Validators.required]),
        payment_branch_id: new FormControl('', [Validators.required]),
        total_payable_amount: new FormControl((parseFloat(res[0]["total_payable_amount"])).toFixed(2)),
        payment_mode: new FormControl('', Validators.required),
        instrument_date: new FormControl('', Validators.required),
        instrumentNo: new FormControl('', Validators.required),
        payment_bank_name: new FormControl('', Validators.required),
        refund_payment_remarks: new FormControl(this.paymentdetail?'Excess Payment Refund':''),
        refundTransactionCategory: this.fb.array(
          res[0].paymentdetails.map((datum) => this.generateDatumFormGroup(datum))
        ),
      });
      console.log(this.productForms.value.refundTransactionCategory)
      this.capacity = this.productForms.value.refundTransactionCategory
     for(let i=0;i<this.capacity.length;i++) {
       this.Totalcontribution += parseFloat(this.capacity[i].payment_contribution_amount);
       this.totalInterest += parseFloat(this.capacity[i].payment_interest_amount)
       this.totalpayable += parseFloat(this.capacity[i].payment_total_amount)
     }
    }, error => {
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })

  }
  approvalUploadView(path){
    if (path == undefined || path == '') {
      this.tosatr.error('No file Found');
    } else {
      this.isLoading = true;
      this.pfservice.downloadRefundFile(path).subscribe(res => {
        this.isLoading = false;

      
          let blob: any = new Blob([res], { type: 'application/' + path.split('.').pop() });
          const url = window.URL.createObjectURL(blob);

          open(url)
      
      }, error => {
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }
  }
  
  get registerFormControl() {
    return this.productForms.controls;
  }
  private getBranchName = async () => {
    this.masterBranch.getBranchlist().subscribe(res => {
      this.branch_name = res['data']
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  editdata
  private generateDatumFormGroup = (datum) => {
    return this.fb.group({
      payment_advise_ref_no: this.fb.control({ value: datum.payment_advise_ref_no, disabled: false }),
      payment_contribution_amount: this.fb.control({ value: Math.round(parseFloat(datum.payment_contribution_amount) * 1000) / 1000, disabled: false }),
      payment_dtl_company_id: this.fb.control({ value: datum.payment_dtl_company_id, disabled: false }),
      payment_employee_id: this.fb.control({ value: datum.payment_employee_id, disabled: false }),
      payment_interest_amount: this.fb.control({ value: Math.round(parseFloat(datum.payment_interest_amount) * 1000) / 1000, disabled: false }),
      payment_refund_ref_no: this.fb.control({ value: datum.payment_refund_ref_no, disabled: false }),
      payment_total_amount: this.fb.control({ value: Math.round(parseFloat(datum.payment_total_amount) * 1000) / 1000, disabled: false }),
      employee_name: this.fb.control({ value: datum.employee_name, disabled: false }),
      employee_id_no: this.fb.control({ value: datum.employee_id_no, disabled: false }),
    });
  }
  collectionmode = [
    { collectionmodes: 'Cheque' },
  ]

  cheque;
  changeCollection(event) {
  if (event.target.value === 'Cheque') {
      this.cheque = true
    }
  }
  submitted
  approvedpayment
  submitRefund



  async changeBranchName() {
    await this.collection.getCollectionAccoutByBranchId(this.productForms.value.payment_branch_id).subscribe(res => {
      this.getaccounttypes = res;
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  selectedSimpleItem = []

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.org_name.toLocaleLowerCase().indexOf(term) > -1 || item.company_account_no.toLocaleLowerCase().indexOf(term) > -1;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }
}
