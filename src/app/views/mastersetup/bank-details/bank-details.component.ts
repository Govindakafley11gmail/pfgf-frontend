import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {MasterService} from '../../_service/master/master.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit , OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  bankdetails: FormGroup;
  bankDetail;
  ids;
  depatment;

  org_Id;
  constructor(private router: Router, private fb: FormBuilder, private tosatr: ToastrService, private masterservice:MasterService) { }


  ngOnInit(): void {
    this.BankDetailsFormcontrol()
    this.getBankDetailsDetails();

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

  BankDetailsFormcontrol() {
    this.bankdetails = this.fb.group({
      bank_id: ['' ],
      bank_code: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      bnk_branch: ['', [Validators.required]],
    })
  }
submitted:any;
  createBankDetails() {
    if(this.bankdetails.invalid){
      this.submitted = true;
      return;
    }
    else {
      this.isLoading = true;
        this.masterservice.createBankDetails(this.bankdetails.value).subscribe(res => {
        this.getBankDetailsDetails();
        this.tosatr.success('Created successfully!!!')
        this.isLoading = false;
        this.myModal.hide();
        this.bankdetails.reset();
        this.ngOnDestroy();

      }, error => {
        this.isLoading = false;
       this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.myModal.hide()
      })
    }
  }

  getBankDetailsDetails() {
    this.isLoading = true;
    this.masterservice.getBankDetails().subscribe(res => {
      this.isLoading = false;
      this.bankDetail = res['data']
      this.dtTrigger.next();
      this.ngOnDestroy();
    },error=>{
     this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  show(id) {
    this.ids = id
    this.myModals.show();
  }
  deleteBankDetailsById(id) {
    this.isLoading = true;
    this.masterservice.deleteBankDetailsById(id).subscribe(res => {
      this.tosatr.success('Deleted successfully!!!')
      this.myModals.hide();
      this.isLoading = false;
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  getBankDetailsById(id) {
    this.masterservice.getBankDetailsById(id).subscribe(res => {
      this.myModal.show()
      this.bankdetails = this.fb.group({
        bank_id: [res['data']['bank_id']],
        bank_code: [res['data']['bank_code']],
        bank_name: [res['data']['bank_name']],
        bnk_branch: [res['data']['bnk_branch']]
      })
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  updateBankDetailsById() {
    this.isLoading = true;
    this.masterservice.updateBankDetailsById(this.bankdetails.value.bank_id, this.bankdetails.value).subscribe(res => {
      this.tosatr.success('Updated successfully!!!');
      this.myModal.hide();
      this.bankdetails.reset();
      this.isLoading = false;
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
     this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.bankdetails.reset();
      this.myModal.show();
    }
  get registerFormControl() {
    return this.bankdetails.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
