import {Component, OnInit, ViewChild} from '@angular/core';

import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {CollectionService} from '../../_service/collection/collection.service';
import {CompanyService} from '../../_service/GF-API/company.service';
import {EmployeeService} from '../../_service/GF-API/employee.service';
import {MasterService} from '../../_service/master/master.service';
import {PfserviceService} from '../../_service/pf/pfservice.service';
import {PfemployeeService} from '../../_service/pfemployee/pfemployee.service';
import {UserService} from '../../_service/user.service';

@Component({
  selector: 'app-account-posting',
  templateUrl: './account-posting.component.html',
  styleUrls: ['./account-posting.component.scss']
})
export class AccountPostingComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  @ViewChild('myModal') public myModal: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  productForm: FormGroup;
  ledgerSearchgroup: FormGroup;
  voucherType;
  postingbranch;
  accountgroup;
  searchResultshow;
  accounttype;
  searchAccountPosting;
  getLedgerAccount;
  ledgerReferenceNo: FormGroup;
  companyList;
  employeeActiveEmployeeList;
  referenceNo;
  searchResults;
  refNo;
  document;
  isDissabled = true;
  constructor(private tosatr: ToastrService, private gfEmployee: EmployeeService, private pfemployee: PfemployeeService, private gfCompany: CompanyService, private fb: FormBuilder, private masterservice: MasterService, private userService: UserService, private collection: CollectionService, private pfservice: PfserviceService) {
  }

  ngOnInit(): void {
    this.listpermission();
    this.VoucherType()
    this.postingBranch()
    this.accountGroup()
    this.searchformcontrol()
    this.referenceNoFormControl()
    this.refNo = true;
    this.productForm = this.fb.group({
      voucher_type: new FormControl('', Validators.required),
      voucher_date: new FormControl('', Validators.required),
      posting_branch: new FormControl('', Validators.required),
      posting_amount: new FormControl('', Validators.required),
      reference_No: new FormControl(''),
      posting_Ref_No: new FormControl(''),
      posting_description: new FormControl(''),
      instrumentNo: new FormControl(''),
      instrumentDate: new FormControl(''),
      instrumentBank: new FormControl(''),
      quantities: this.fb.array([]),
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

  searchformcontrol() {
    this.ledgerSearchgroup = this.fb.group({
      account_group: new FormControl('',Validators.required),
      account_group_type: new FormControl('',Validators.required),
      reg_branch: new FormControl('',Validators.required),

    });
  }

  referenceNoFormControl() {
    this.ledgerReferenceNo = this.fb.group({
      relation_type: new FormControl('',Validators.required),
      org_name: new FormControl(''),
      employee_name: new FormControl(''),
      identification_no: new FormControl(''),
      email_id: new FormControl(''),
      mobile_no: new FormControl(''),
    });
  }

  VoucherType() {
    this.masterservice.getAccountTypeDetails().subscribe(res => {
      console.log(res)
 
      this.voucherType = res['data']
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  accountPosting
  listPermission = []
  listpermission(){
    this.userService.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'accountposting'){
          console.log(this.listPermission[j])
          this.accountPosting = true;
          this.isDissabled = false;
         
        }
      }
    })
  }

  postingBranch() {
    this.userService.getBranchlist().subscribe(res => {
      console.log(res)
      this.postingbranch = res['data']
    })
  }
  accountGroup() {
    this.masterservice.getAccountGroupDetails().subscribe(res => {
      console.log(res)
      this.accountgroup = res['data']
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  i
  showAccountLedgerModel(i) {
    this.i = i
    console.log(i)
    this.myModals.show()
    this.searchResultshow = false
    this.searchResults = false;
    this.ledgerSearchgroup.reset()


  }

  searchByReferenceNumber() {
    if(this.ledgerReferenceNo.invalid){
      this.submitted = true;
      return;
    }else{
      this.isLoading = true;
      this.collection.searchAccountpostingByReferenceNumber(this.ledgerReferenceNo.value).subscribe(res => {
        this.searchResultshow = true
        this.isLoading = false;
        this.searchAccountPosting = res
        this.dtTrigger.next();
      },error =>{
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })
    }

  }

  collectLedgerSearchToArray = []
  searchResult() {
    console.log(this.ledgerSearchgroup.value)
    if(this.ledgerSearchgroup.invalid){
      this.submitted = true;
      return;
    }else{
      this.isLoading = true;
      this.collection.searchAlltheAccountPostingData(this.ledgerSearchgroup.value).subscribe(res => {
        this.searchResults = true;
        this.isLoading = false;
        this.searchAccountPosting = res['ledger_search_data']
        this.dtTrigger.next();
      },error=>{
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false
      })
    }

  }

  changeSearchReferenceNumber(data) {
    this.myModal.hide()
    let rows = this.productForm.get('reference_No')
    let row = this.productForm.get('posting_Ref_No')
    row.patchValue(data['PartyId'] + '*' + data['RefNumber'] + '*' + data['PartyName'] + '*' + data['RelationType']);
    rows.patchValue(data['PartyName']);
    console.log(this.productForm.value)

  }

  ChangeAccountGroup() {

    this.masterservice.getAccountTypeDetailsBygroupCode(this.ledgerSearchgroup.value.account_group).subscribe(res => {
      console.log(res)
      this.accounttype = res['data']
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  changeledgerData(data) {
    console.log(data)
    this.getLedgerAccount = this.i;
    let rows = this.productForm.get('quantities') as FormArray;
    rows.controls[this.i].patchValue({ account_ledger: data['branch_name']+'/'+ data['account_group_name'] + '('+data['acc_code']+')'+ '/' + data['acc_name'] });
    rows.controls[this.i].patchValue({ account_ledger_id: data['account_group_id'] + '*' + data['account_group_name'] + '*' + data['account_type_id'] + '*' + data['acc_name'] + '*' + data['branch_id'] });
    this.myModals.hide()
    console.log(this.productForm.value)
    this.searchResults = false
  }

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      account_ledger: new FormControl('', Validators.required),
      debit_credit: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      account_ledger_id: new FormControl('', Validators.required)
    })
  }

  addQuantity() {
      this.quantities().push(this.newQuantity());

  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  changeLegderAcc(data) {
    console.log(data)
  }
  submitted
  isEqualdebitAndCredit
  acPostingDocument
  submitAccountPostingData() {
    if(this.productForm.value.voucher_type != 'MP'){
    if (this.creditValue != this.debitvalue) {
      this.isEqualdebitAndCredit = false
    }

    if (this.productForm.invalid) {

      this.submitted = true
      return
    }
    if (this.isEqualdebitAndCredit || this.productForm.value.posting_amount != this.creditValue) {
      this.tosatr.warning("Debit and credit amount is not equal")
    }
    else {
      this.isLoading = true;
      this.collection.AccountPosting(this.productForm.value).subscribe(res => {
        this.isLoading = false;
      
        console.log(res)
        if(res[0] == 'success'){
          this.isDissabled = true;
          this.document = true;
          this.dissabled = true;
          this.acPostingDocument = res['filepath'];
          this.tosatr.success("Account posting is submitted successfully")
        }else{
          this.isDissabled = false;
          this.dissabled = false;
          this.document = false;
          this.tosatr.success("Account posting is Failed to submitted")
        }
       
      },error=>{
        this.dissabled = false;
        this.isDissabled = false;
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })

    }
  }
    else {
      this.isLoading = true;
      this.collection.AccountPosting(this.productForm.value).subscribe(res => {
        this.isLoading = false;
      
        console.log(res)
        if(res[0] == 'success'){
          this.isDissabled = true;
          this.document = true;
          this.dissabled = true;
          this.acPostingDocument = res['filepath'];
          this.tosatr.success("Account posting is submitted successfully")
        }else{
          this.isDissabled = false;
          this.dissabled = false;
          this.document = false;
          this.tosatr.success("Account posting is Failed to submitted")
        }
       
      },error=>{
        this.dissabled = false;
        this.isDissabled = false;
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.isLoading = false;
      })

    }

  }
  creditValue
  debitvalue
  changeAccountPosyting() {
    this.creditValue = 0
    this.debitvalue = 0
    console.log(this.productForm.value)
    for (let i = 0; i < this.productForm.value.quantities.length; i++) {
      if (this.productForm.value.quantities[i].debit_credit == 'CR') {
        this.creditValue += this.productForm.value.quantities[i].amount
      }
      else if (this.productForm.value.quantities[i].debit_credit == 'DR') {
        this.debitvalue += this.productForm.value.quantities[i].amount
      } else {
        return;
      }
    }

  }

  voucherTypes = [
    { accounttype: 'CON' },
    { accounttype: 'JV' },
    { accounttype: 'RV' },
    { accounttype: 'PV' },
    { accounttype: 'MP' },
  ]

  RelationType = [
    { relationtype: 'PF Company' },
    { relationtype: 'GF Company' },
    { relationtype: 'PF Employee' },
    { relationtype: 'GF Employee' },
    { relationtype: 'Other Stakeholders' },
  ]

  showModelReferenceNo() {
    this.myModal.show()

  }

  ChangeRelationType() {
    if (this.ledgerReferenceNo.value.relation_type == 'PF Company') {
      this.companyName();
    } else if (this.ledgerReferenceNo.value.relation_type == 'GF Company') {
      this.gfCompanyName();
    }
    else if (this.ledgerReferenceNo.value.relation_type == 'PF Employee') {
      this.getPFEmployeeName();
    } else if (this.ledgerReferenceNo.value.relation_type == 'GF Employee') {
      this.getGFEmployeeName();
    } else {
      this.getStakeHolder();
    }

  }
  ComppartyType = true
  EmppartyType
  stakeholder

  companyName() {
    this.pfservice.PFcompaneyRegistrationList().subscribe(res => {
      this.ComppartyType = true
      this.EmppartyType = false
      this.stakeholder = false
      this.companyList = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  gfCompanyName() {
    this.gfCompany.PFcompaneyRegistrationList().subscribe(res => {
      this.ComppartyType = true
      this.EmppartyType = false
      this.stakeholder = false
      this.companyList = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  getPFEmployeeName() {
    this.pfemployee.getPfEmployeeDetails().subscribe(res => {
      this.ComppartyType = false;
      this.EmppartyType = true;
      this.stakeholder = false;
      this.companyList = res['data']['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  getGFEmployeeName() {
    this.gfEmployee.getPfEmployeeDetails().subscribe(res => {
      console.log(res)
      this.ComppartyType = false
      this.EmppartyType = true
      this.stakeholder = false
      this.companyList = res['data']
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  partystype
  RvAndPv
  getStakeHolder() {

    this.masterservice.getpartytypeDetails().subscribe(res => {
      this.partystype = res
      this.ComppartyType = false
      this.EmppartyType = false
      this.stakeholder = true
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })

  }

  changeVoucherType() {


    for (let i = 0; i < this.productForm.value.quantities.length; i++) {
      this.removeQuantity(i--)
    }
    if( this.productForm.value.voucher_type == 'CON'){
      this.refNo = false;
    }else{
      this.refNo = true;
    }

    if (this.productForm.value.voucher_type == 'JV' ||
      this.productForm.value.voucher_type == 'RV' ||
      this.productForm.value.voucher_type == 'PV' ||
      this.productForm.value.voucher_type == 'MP' ||
      this.productForm.value.voucher_type == 'CON') {
     
      for (let i = 0; i < 2; i++) {
        this.addQuantity()
        if (i == 1) {
          i = 0;
          break;
        }
      }
    } if (this.productForm.value.voucher_type == 'RV' || this.productForm.value.voucher_type == 'PV') {
      this.RvAndPv = true;
    } else {
      this.RvAndPv = false;
    }
  }

  indicator = [
    { debit_credit: 'DR' },
    { debit_credit: 'CR' }
  ]

  get registerFormControl() {
    return this.productForm.controls;
  }

  get registerFormControls() {
    return this.ledgerSearchgroup.controls;
  }
  get refNoFormControl() {
    return this.ledgerReferenceNo.controls;
  }

  viewDocumentAccountposting(docPath){
   this.collection.downloadReportAccountPosting(docPath).subscribe(res => {
      this.isLoading = false;

      let blob: any = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      open(url);
    }, error => {
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  dissabled

  resetAccountPostingData(){
    this.productForm.reset();
    this.isDissabled = false;
    this.dissabled = false;
  }

  selectedSimpleItem = []
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.acc_name.toLocaleLowerCase().indexOf(term) > -1 || item.acc_description.toLocaleLowerCase().indexOf(term) > -1;
  }

}
