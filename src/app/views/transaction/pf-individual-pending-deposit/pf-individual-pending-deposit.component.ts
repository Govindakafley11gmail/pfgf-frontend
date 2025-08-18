import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject, Subscription} from 'rxjs';
import {CollectionService} from '../../_service/collection/collection.service';
import {GfcollectionService} from '../../_service/GF-API/gfcollection.service';
import {PfemployeeService} from '../../_service/pfemployee/pfemployee.service';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-pf-individual-pending-deposit',
  templateUrl: './pf-individual-pending-deposit.component.html',
  styleUrls: ['./pf-individual-pending-deposit.component.scss']
})
export class PfIndividualPendingDepositComponent implements OnInit, OnDestroy {
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // Now Angular will recognize it

  @ViewChild('myModal') public myModal: ModalDirective;
  subscription: Subscription
  pendingdepositlist
  ifindividualdepositselected;
  getByCollectionInDividualdepositNo;
  value;
  total;
  total_employer: number;
  edit;
  update;
  data;
  contenteditable;

  isdissable = true;
  employeecontribution = '';
  employeercontribution = '';
  message_forField_employee
  message_forField_employer;
  companyname;
  pfIndividualDeposit: FormArray = new FormArray([]);
  pfIndividualDepositemployer: FormArray = new FormArray([])
  pfindividual;
  pfindividual_employer;
  e;
  employeeCont;
  employee_contribution_amount
  capacity = []
  capacitys
  pfindividualdeposit;
  editField;
  personList;
  companyid;
  pf_collection_branchid;
  collection_no;
  collectionForTheMonth;
  pfCollectionForTheYear;
  pfcollectiondate;
  pfcollectionid;
  editpfindividual;
  eventhandeler;
  Collection_Receipt_No;
  collectionRecieptNo = ''
  companyacno;
  chnage_collection;
  changecomAccNo;
  changecomAccNos;
  approved;
  collectionrecieptno
  constructor(private collection: CollectionService, private tosatr: ToastrService, private pfemployee: PfemployeeService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,private gfcollection:GfcollectionService,private master:UserService) { }


  ngOnInit(): void {
    this.getpendingDepositDataList()
    this.pfindividual = true;
    // this.capabilityformcontril()

    this.capabilityForms = false
    this.approved = true

    this.capabilityForm = this.fb.group({
      collectionRecieptNo: new FormControl(''),
      pf_company_id: new FormControl(''),
      pf_collection_id: new FormControl( ''),
      pf_collection_date: new FormControl(''),
      pf_collection_for_the_year: new FormControl(''),
      pf_collection_for_the_month: new FormControl(''),
      totalReceiptAmount: new FormControl(''),
      checkTotalDeposit:new FormControl(''),
      pf_collection_no: new FormControl(''),
      collection_branch_id: new FormControl(''),
      excess_payment_amount: new FormControl(''),
      org_name:new FormControl(),
      comp_acc_no: new FormControl(),
      pfEmployeeId: this.fb.array(
       []
      ),

    });
  }
  generateDoc() {
    this.isLoading = true;
    this.collection.generateDocument(this.capabilityForm.value).subscribe(res=>{
      this.isLoading = false;
      let blob = new Blob([res], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      open(url);
    })
  }

  create(id,type) {
    this.myModal.show()
    this.collectionrecieptno = id
    this.ChangePfindividualDeposit(id,type)
  }

  async getpendingDepositDataList() {
    this.isLoading = true;
    await this.collection.getpendingDepositDataList().subscribe(res => {
      this.isLoading = false;
      this.pendingdepositlist = res
      console.log(res)
      this.listpermission();
      this.dtTrigger.next();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }
  userDepositprocess
  listPermission = []
  listpermission(){
    this.master.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'create-deposits'){
          console.log(this.listPermission[j])
          this.userDepositprocess = true;
        }
      }
    })
  }
  editdata

  capabilityForm: FormGroup;
  capabilityForms;
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

  private generateDatumFormGroup(datum) {
    return this.fb.group({
      id: this.fb.control({ value: datum.id, disabled: false }),
      employee_name: this.fb.control({ value: datum.employee_name, disabled: false }),
      company_account_no: this.fb.control({ value: datum.employee_id_no, disabled: false }),
      identification_no: this.fb.control({ value: datum.identification_no, disabled: false }),
      employee_contribution_amount: this.fb.control({ value: parseFloat(datum.employee_contribution_amount).toFixed(2), disabled: false }),
      employer_contribution_amount: this.fb.control({ value: parseFloat(datum.employer_contribution_amount).toFixed(2), disabled: false }),
      pf_employee_id: this.fb.control({ value: datum.pf_employee_id, disabled: false })
    });

  }

  adddata;
  adddatas;
  totalcollectionamount;
  addData() {
    this.adddata = this.capabilityForm.value.pfEmployeeId;
    this.total_employee = 0;
    this.total_employer = 0;
    for (let i = 0; i < this.adddata.length; i++) {
      if (this.adddata[i].employee_contribution_amount) {
        this.total_employee += parseFloat(this.adddata[i].employee_contribution_amount);
        this.total_employer += parseFloat(this.adddata[i].employer_contribution_amount);
        this.totalcollectionamount = parseFloat(this.total_employee + this.total_employer).toFixed(2);

      }
    }
    this.capabilityForm.patchValue({
      checkTotalDeposit: parseFloat(this.totalcollectionamount).toFixed(2)
    })
  }

  chekTotalDeposit
  total_employee
  ishandelChange = false;
  addDatas() {
    this.adddata = this.capabilityForm.value.pfEmployeeId;
    this.adddatas = 0;
    this.total_employer = 0;
    this.totalcollectionamount = 0;
    this.total_employee = 0;
    for (let i = 0; i < this.adddata.length; i++) {
      if (this.adddata[i].employee_contribution_amount) {
        this.total_employee += parseFloat(this.adddata[i].employee_contribution_amount);
        this.total_employer += parseFloat(this.adddata[i].employer_contribution_amount)
       this.totalcollectionamount +=parseFloat(this.adddata[i].employer_contribution_amount) +parseFloat(this.adddata[i].employee_contribution_amount)
      }
    }
    this.capabilityForm.patchValue({
      checkTotalDeposit: parseFloat(this.totalcollectionamount).toFixed(2)
    })
  }

  pf_collection_amount
  collectionReceiptNo
  doc_path
  doc2
  doc_path2
  ChangePfindividualDeposit(id,type) {
    this.isLoading = true;
    this.pfindividual = false;
    this.update = false;
    this.edit = true;
    if (id != null) {
      if(type == 'PF'){
        this.subscription = this.collection.getcollectionReceiptNo(id).subscribe(res => {
          console.log(res)
          this.capabilityForms = true;
          this.collectionReceiptNo= res
          this.isLoading = false;
          if(res[0].get_document_data.length==1){
            this.doc2 = false;
            this.doc_path = res[0].get_document_data[0].doc_path;
          }else{
            this.doc2 = true;
            this.doc_path2 = res[0].get_document_data[1].doc_path;
          }
          this.capabilityForm = this.fb.group({
            excess_payment_amount: new FormControl(res[0].excess_refund_amount),
            registration_type: new FormControl(this.collectionReceiptNo[0].registration_type),
            collectionRecieptNo: new FormControl(id),
            pf_company_id: new FormControl(res[0].collection_company.company_id),
            pf_collection_id: new FormControl(res[0].pf_collection_id),
            pf_collection_date: new FormControl(res[0].pf_collection_date),
            pf_collection_for_the_year: new FormControl(res[0].pf_collection_for_the_year),
            pf_collection_for_the_month: new FormControl(res[0].pf_collection_for_the_month),
            totalReceiptAmount: new FormControl(parseFloat(res[0]['pf_collection_amount']).toFixed(2)),
            checkTotalDeposit:new FormControl(''),
            pf_collection_no: new FormControl(res[0].pf_collection_no),
            collection_branch_id: new FormControl(res[0].pf_collection_branch_id),
            org_name:new FormControl(res[0].collection_company.org_name),
            comp_acc_no: new FormControl(res[0].collection_company.company_account_no),
            pfEmployeeId: this.fb.array(
              res[0].collection_company.pf_employees.map((datum) => this.generateDatumFormGroup(datum))
            ),
          });
          this.capacity = this.capabilityForm.value.pfEmployeeId;
          this.addData();
          this.addDatas();
        }, (error) => {
          this.myModal.hide()
          this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
          this.getByCollectionInDividualdepositNo = "";
          this.capacity = [];
        })

      } else{
        this.subscription = this.collection.getGfCollectionReceiptNo(id).subscribe(res => {
          console.log(res)
          this.capabilityForms = true;
          this.collectionReceiptNo= res
          this.isLoading = false;
          this.doc_path = res[0].get_document_data[0].doc_path;
          if(res[0].get_document_data.length==1){
            this.doc2 = false;
            this.doc_path = res[0].get_document_data[0].doc_path;
          }else{
            this.doc2 = true;
            this.doc_path2 = res[0].get_document_data[1].doc_path;
          }
          this.capabilityForm = this.fb.group({
            excess_payment_amount: new FormControl(res[0].excess_refund_amount),
            registration_type: new FormControl(this.collectionReceiptNo[0].registration_type),
            collectionRecieptNo: new FormControl(id),
            pf_company_id: new FormControl(res[0].collection_company.company_id),
            pf_collection_id: new FormControl(res[0].pf_collection_id),
            pf_collection_date: new FormControl(res[0].pf_collection_date),
            pf_collection_for_the_year: new FormControl(res[0].pf_collection_for_the_year),
            pf_collection_for_the_month: new FormControl(res[0].pf_collection_for_the_month),
            totalReceiptAmount: new FormControl(parseFloat(res[0]['pf_collection_amount']).toFixed(2)),
            checkTotalDeposit:new FormControl(''),
            pf_collection_no: new FormControl(res[0].pf_collection_no),
            collection_branch_id: new FormControl(res[0].pf_collection_branch_id),
            org_name:new FormControl(res[0].collection_company.org_name),
            comp_acc_no: new FormControl(res[0].collection_company.company_account_no),
            pfEmployeeId: this.fb.array(
              this.collectionReceiptNo[0].collection_company.gf_employees.map((datum) => this.generateDatumFormGroup(datum))
            ),
          });
          this.capacity = this.capabilityForm.value.pfEmployeeId;
          this.addData();
          this.addDatas();
        }, (error) => {
          this.isLoading = false;
          this.myModal.hide()
          this.tosatr.error(error['statusText'] +". "+error.error.message);
          this.getByCollectionInDividualdepositNo = "";
          this.capacity = [];
        })
      }

    } else {
      this.isLoading = false;
      this.getByCollectionInDividualdepositNo = "null";
    }
  }
  totalreceiptamt;
  checkdeposit;
  approvedTransaction() {
    this.isLoading = true;
  //  return;
 this.checkdeposit = parseFloat(this.capabilityForm.value.checkTotalDeposit).toFixed(2)
this.totalreceiptamt = (parseFloat(this.capabilityForm.value.totalReceiptAmount)-(this.capabilityForm.value.excess_payment_amount)).toFixed(2)
  if (this.checkdeposit == this.totalreceiptamt)   {
    if(this.capabilityForm.value.registration_type=='PF'){
        this.collection.approvedtransaction(this.capabilityForm.value).subscribe(res => {
          this.capabilityForm.reset(this.capabilityForm);
          this.isLoading = false;
          this.tosatr.success('Approved successfully!!!')
          this.getpendingDepositDataList();
          this.capabilityForms = false;
          this.pfindividual = true;
          this.approved = false;
          this.myModal.hide();
          this.ngOnDestroy()
        }, (error) => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
        })
      }
      else{
        this.gfcollection.approvedtransaction(this.capabilityForm.value).subscribe(res => {
          this.capabilityForm.reset(this.capabilityForm);
          this.isLoading = false;
          this.tosatr.success('Approved successfully!!!')
          this.getpendingDepositDataList();
          this.capabilityForms = false;
          this.pfindividual = true;
          this.approved = false;
          this.myModal.hide();
          this.ngOnDestroy()
        }, (error) => {
          this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
        })
      }

    }
    else {
      this.eventhandeler = false
      this.tosatr.warning("Total amount is not equal to employee amt and employer amt.")
      this.isLoading = false;
    }
  }
  pdf
 async viewDocument(id){
    if (id != null) {
      this.isLoading = true;
      await this.collection.downloadCollectionSlip(id).subscribe(
        (res) => {
          this.pdf = res;
          this.isLoading = false;
          let blob: any = new Blob([this.pdf], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          open(url);
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    } else {
      this.tosatr.warning("No File Found");
    }
  }

  updateData(event){
    this.capabilityForm.value.pfEmployeeId.forEach(element => {
     if(event.id === element.id){
      console.log(element)
      this.collection.updateEmployee(element).subscribe(res=>{
        this.tosatr.success('Success');
      })
     }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
