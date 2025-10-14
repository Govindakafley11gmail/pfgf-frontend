import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CollectionService } from '../../_service/collection/collection.service';

@Component({
  selector: 'app-pf-individual-approved-deposit',
  templateUrl: './pf-individual-approved-deposit.component.html',
  styleUrls: ['./pf-individual-approved-deposit.component.scss']
})
export class PfIndividualApprovedDepositComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: any = DataTableDirective;
  approveddepositlist;
  capabilityForms;
  capabilityForm: FormGroup;
  adddata
  adddatas
  completedForm;
  viewDeposit;
  Api_Http = "http://172.16.16.161:8089/bil_pf_system/api";

  headers = new HttpHeaders({

    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  constructor(private tosatr: ToastrService, private collection: CollectionService, private fb: FormBuilder, private httpclient: HttpClient) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   lengthMenu: [10, 50, 100, 1000, 10000],
    //   processing: true,
    //   paging: false
    // };
    this.getpendingDepositDataList()
    this.capabilityForm = this.fb.group({
      excess_payment_amount: new FormControl(''),
      registration_type: new FormControl(''),
      collectionRecieptNo: new FormControl(''),
      org_name: new FormControl(''),
      pf_collection_date: new FormControl(''),
      pf_collection_for_the_year: new FormControl(''),
      pf_collection_for_the_month: new FormControl(''),
      totalRecieptAmount: new FormControl(''),
      checkTotalDeposit: new FormControl(''),
      pf_collection_no: new FormControl(''),
      collection_branch_id: new FormControl(''),
      company_account_no: new FormControl(''),
      pfEmployeeId: this.fb.array([]),
    });
  }

  viewFormControl(id) {
    this.viewDeposit = true;
    this.myModal.show();
    this.collection.getCollectionBtCollectionId(id).subscribe(res => {
      console.log(res)
      this.capabilityForms = true;
      this.capabilityForm = this.fb.group({
        excess_payment_amount: new FormControl(res[0]['excess_refund_amount']),
        registration_type: new FormControl(res[0]['registration_type']),
        collectionRecieptNo: new FormControl(res[0]['pf_collection_no']),
        org_name: new FormControl(res[0]['org_name']),
        pf_collection_date: new FormControl(res[0]['pf_collection_date']),
        company_account_no: new FormControl(res[0]['company_account_no']),
        pf_collection_for_the_year: new FormControl(res[0]['pf_collection_for_the_year']),
        pf_collection_for_the_month: new FormControl(''),
        totalRecieptAmount: new FormControl((res[0]['pf_collection_amount'])),
        pf_collection_no: new FormControl(res[0]['pf_collection_no']),
        collection_branch_id: new FormControl(res[0]['reg_branch_id']),
        pfEmployeeId: this.fb.array(
          res[0].get_employee_details.map((datum) => this.generateDatumFormGroup(datum))
        ),
      });

      this.capacity = this.capabilityForm.value.pfEmployeeId;
      this.addData();
      this.addDatas();
    }, (error) => {
      this.tosatr.error(error['statusText'] + ". " + error.error.message);
      this.capacity = [];
    })
  }
  premiumData: any[] = [];
  paginateData: any[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = 0;


  async  getpendingDepositDataList() {
      this.isLoading = true;
  await  this.collection.getapprovedDepositDataList().subscribe(res => {
    console.log(res)
        this.isLoading = false
        this.dtTrigger.next();
        this.approveddepositlist = res['data'];
        this.collectionSize = res['total'];
         this.ngOnDestroy();
      }, error => {
        this.isLoading =false;
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      })


  }

  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  getPremiumData(page) {
    this.httpclient.get<any>(`${this.Api_Http}/list-approved-deposits-list?pages=${page}`, { headers: this.headers }).subscribe(res => {
      console.log(res)
      this.approveddepositlist = res['data'];
      this.collectionSize = res['total'];
      this.dtTrigger.next();
      this.ngOnDestroy();
    })
    console.log(page)
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  start() {
    this.isLoading = true;
    this.wait(2000).then(() => this.isLoading = false);
  }

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      id: this.fb.control({ value: datum.id, disabled: false }),
      employee_name: this.fb.control({ value: datum.employee_name, disabled: false }),
      company_account_no: this.fb.control({ value: datum.company_pf_acc_no, disabled: false }),
      identification_no: this.fb.control({ value: datum.identification_no, disabled: false }),
      employee_contribution_amount: this.fb.control({ value: datum.employee_contribution_amount, disabled: false }),
      employer_contribution_amount: this.fb.control({ value: datum.employer_contribution_amount, disabled: false }),
      pf_employee_id: this.fb.control({ value: datum.pf_employee_id, disabled: false }),
      identification_types: this.fb.control({ value: datum.identification_types, disabled: false })
    });

  }
  total_employer
  totalcollectionamount
  collectionReceiptNo
  capacity
  addData() {
    this.adddata = this.capabilityForm.value.pfEmployeeId;

    this.adddatas = 0;
    this.total_employer = 0;
    this.totalcollectionamount = 0;
    for (let i = 0; i < this.adddata.length; i++) {
      if (this.adddata[i].employee_contribution_amount) {
        this.adddatas += parseFloat(this.adddata[i].employee_contribution_amount);
        this.total_employer += parseFloat(this.adddata[i].employer_contribution_amount)
        this.totalcollectionamount = this.adddatas + this.total_employer;
      }
    }
  }

  chekTotalDeposit
  addDatas() {
    this.adddata = this.capabilityForm.value.pfEmployeeId;
    this.adddatas = 0;
    this.total_employer = 0;
    this.chekTotalDeposit = 0;
    for (let i = 0; i < this.adddata.length; i++) {
      if (this.adddata[i].employee_contribution_amount) {
        this.adddatas += parseFloat(this.adddata[i].employee_contribution_amount);
        this.total_employer += parseFloat(this.adddata[i].employer_contribution_amount)
        this.chekTotalDeposit += parseFloat(this.adddata[i].employer_contribution_amount) + parseFloat(this.adddata[i].employee_contribution_amount)
      }
    }
  }
  async downloadDocument(doc_name) {
    this.isLoading = true;
    await this.collection.downloadReport(doc_name).subscribe(res => {
      this.isLoading = false;

      let blob: any = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      open(url);
    }, error => {
      this.tosatr.error(error['statusText'] + ". " + error.error.message);
      this.isLoading = false;
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}