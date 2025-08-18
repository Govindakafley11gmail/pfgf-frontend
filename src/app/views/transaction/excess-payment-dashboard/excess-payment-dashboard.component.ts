import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { CollectionService } from '../../_service/collection/collection.service';
import {CompanyService} from '../../_service/GF-API/company.service';
import {PfserviceService} from '../../_service/pf/pfservice.service';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-excess-payment-dashboard',
  templateUrl: './excess-payment-dashboard.component.html',
  styleUrls: ['./excess-payment-dashboard.component.scss']
})

export class ExcessPaymentDashboardComponent implements OnInit{

  companyName
  excessRefund: FormGroup;
  collection_receipt_no
  allExcessRefund
  listbranch
  submitted;
  isDissabled = true;
  documentshow;
  org_name:String;
  constructor(private collection:CollectionService,private tosatr: ToastrService, private fb: FormBuilder, private gfcompanyDetails: CompanyService, private pfservice: PfserviceService, private msterservice: UserService) { }


  ngOnInit(): void {
    this. listpermission();
    this.excessRefundFormControl()
    this.listBranch();
  }
  RefundExcessRefunds
  listPermission = []
  listpermission(){
    this.msterservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'refund-excess-payment'){
          this.isDissabled = false;
          this.RefundExcessRefunds = true;
        }
      }
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

  excessRefundFormControl() {
    this.excessRefund = this.fb.group({
      registration_type: new FormControl('', Validators.required),
      company_id: new FormControl('', Validators.required),
      collection_receipt_no: new FormControl('', Validators.required),
      collection_receipt_amt: new FormControl('', Validators.required),
      collection_date: new FormControl('', Validators.required),
      excess_refund_amt: new FormControl('', Validators.required),
      refund_date: new FormControl('', Validators.required),
      branch_id: new FormControl('', Validators.required),
      bank_name: new FormControl('', Validators.required),
      pf_emp_acc_no: new FormControl('', Validators.required),
    })
  }

  refundType = [
    { refundtype: 'PF Refund', value: 'PF' },
    { refundtype: 'GF Refund', value: 'GF' }
  ]

  changeRefundType() {
    if (this.excessRefund.value.registration_type == 'PF') {
      this.getPFCompany();
    } else {
      this.getGFCompany()
    }
  }

  async getPFCompany() {
    this.isLoading = true;
    await this.pfservice.PFcompaneyRegistrationList().subscribe(res => {
      this.isLoading = false;
      if(res['success']) {
        this.companyName = res['data']
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  async getGFCompany() {
    this.isLoading = true;
    await this.gfcompanyDetails.PFcompaneyRegistrationList().subscribe(res => {
      this.isLoading = false;
      if(res['success']) {
        this.companyName = res['data']
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  colRecieptno

  async changeOrgById() {
    this.isLoading = true;
    console.log(this.excessRefund.value.company_id)
    await this.pfservice.getCollectionPendingdataByCompanyId(this.excessRefund.value.company_id).subscribe(res => {
      this.isLoading = false;
      console.log(res)
      this.colRecieptno=res
      if(this.colRecieptno.length>0){
        this.collection_receipt_no = res

      }else{
        this.tosatr.warning('No data found for this organization')
      }

    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  async collectionReceiptNo() {
    this.isLoading = true;
    await this.pfservice.getCollectionPendingcollectionReceiptNo(this.excessRefund.value.collection_receipt_no).subscribe(res => {
      this.collection_receipt_no = res
      this.isLoading = false;
      let rows = this.excessRefund.get('collection_receipt_amt')
      let row = this.excessRefund.get('collection_date')

      rows.patchValue(res['pf_collection_amount'])
      row.patchValue(res['pf_collection_date'])
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  async listBranch() {
    this.isLoading = true;
    await this.msterservice.getBranchlist().subscribe(res => {
      this.listbranch = res['data']
      this.isLoading = false;

    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  resetExcessRefund(){
    this.isDissabled = false;
    this.excessRefund.reset();
  }
  async processExcessPffund() {
    this.isLoading = true;
    if (this.excessRefund.invalid) {
      this.submitted = true;
      this.isLoading = false;
      return;
    } else {

      await this.pfservice.createExcessPffund(this.excessRefund.value).subscribe(res => {
        this.isLoading = false;
        if (res[0] == 'success') {
          this.tosatr.success(res['message'])
          this.isDissabled = true;
        }
        else {
          this.documentshow = false;
          this.tosatr.error(res['message'])
        }
        this.submitted = false;

        // this.getAllExcessRefund()
      },error=>{
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }
  }


  get registerFormControl() {
    return this.excessRefund.controls;
  }



}
