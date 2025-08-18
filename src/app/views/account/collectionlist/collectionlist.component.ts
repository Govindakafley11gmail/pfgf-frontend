import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import { CollectionService } from "../../_service/collection/collection.service";
// import { Gfcollection } from '../../_service/GF-API/gfcollection.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from "../../_service/user.service";
import { PfserviceService } from "../../_service/pf/pfservice.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MasterService } from "../../_service/master/master.service";
import { CompanyService } from "../../_service/GF-API/company.service";
import { GfcollectionService } from "../../_service/GF-API/gfcollection.service";
import { DataTableDirective } from "angular-datatables";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Api} from '../../_service/api'
@Component({
  selector: "app-collectionlist",
  templateUrl: "./collectionlist.component.html",
  styleUrls: ["./collectionlist.component.scss"],
})
export class CollectionlistComponent implements OnInit {
  @ViewChild("myModals") public myModals: ModalDirective;
  @ViewChild("myModal") public myModal: ModalDirective;
  @ViewChild("myModalspdf") public myModalspdf: ModalDirective;
  @ViewChild("pdfTable") pdfTable: ElementRef;
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  Api_Http = Api;

  headers = new HttpHeaders({

    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
  collectiondetails;
  ids;
  showCollection;
  newCollection;
  subscription: Subscription;
  reverseColForm: FormGroup;
  constructor(
    private httpclient:HttpClient,
    private router: Router,
    private tosatr: ToastrService,
    private route: ActivatedRoute,
    private routes: Router,
    private company: CompanyService,
    private gfcollection: GfcollectionService,
    private masterservice: MasterService,
    private pfcollection: CollectionService,
    private fb: FormBuilder,
    private collection: CollectionService,
    private pfservice: PfserviceService,
    private colbranch: UserService
  ) {}

  min: any = 0;
max: any = 0;
  async ngOnInit() {
    this.getCollectionDetails()
    this.reverseFormControl();
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength:10,
    //   lengthMenu : [10, 50, 100,1000,10000],
    //   processing: true, 
    //   paging:   false  
    // };  

  }
  

  reverseFormControl() {
    this.reverseColForm = this.fb.group({
      collection_type: new FormControl("", [Validators.required]),
      pf_collection_id: new FormControl(""),
      pf_collection_date: new FormControl("", [Validators.required]),
      pf_collection_for_the_month: new FormControl("", [Validators.required]),
      pf_collection_for_the_year: new FormControl(new Date(), [
        Validators.required,
      ]),
      pf_collection_amount: new FormControl("", [Validators.required]),
      col_reverse_remarks: new FormControl("", [Validators.required]),
      pf_collection_company_account_no_id: new FormControl("", [
        Validators.required,
      ]),
      pf_collection_branch_id: new FormControl("", [Validators.required]),
      pf_collection_bank_account_no: new FormControl("", [Validators.required]),
      transationalDetails: this.fb.array([]),
    });
  }
  pdf;
  private downloadPdf = async (id) => {
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
  };

  show(id) {
    this.ids = id;
    this.myModals.show();
  }

  create() {
    this.newCollection = true;
    this.myModal.show();
    this.getCollectionBranch();
    this.companyacno = false;
    this.save = true;
    this.getcolyear = false;
    this.productForm = this.fb.group({
      collection_type: new FormControl("", [Validators.required]),
      pf_collection_id: new FormControl(""),
      pf_collection_date: new FormControl("", [Validators.required]),
      pf_collection_for_the_month: new FormControl("", [Validators.required]),
      pf_collection_for_the_year: new FormControl("", [
        Validators.required,
      ]),
      pf_collection_amount: new FormControl("", [Validators.required]),
      pf_collection_narration: new FormControl("", [Validators.required]),
      pf_collection_company_account_no_id: new FormControl("", [
        Validators.required,
      ]),
      pf_collection_branch_id: new FormControl("", [Validators.required]),
      pf_collection_bank_account_no: new FormControl("", [Validators.required]),
      transationalDetail: this.fb.array([]),
    });
  }
  premiumData : any[] = [];
  paginateData: any[] = [];
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  doc
  dissabled
  getCollectionDetails() {
    this.isLoading = true;
    this.subscription = this.collection.getPfCollectionDetails().subscribe(

      (res) => {
        console.log(res);
        this.showCollection = true;
        this.listpermission();
        this.isLoading = false;
        if(res['data'].get_document_data == ''){
          this.doc = false
        }else{
          this.doc = true;
        }
        this.collectiondetails = res['data'];
        this.collectionSize = res['total'];
        this.dtTrigger.next();
        this.ngOnDestroy();
      },
      (error) => {
        console.log(error.status)
        if(error.status == 401) {
          this.dissabled = false;
        }else{
          this.dissabled = false;
        }
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  collectioncreate
  collectionReversed
  listPermission = []
  listpermission(){
    this.colbranch.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
     
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'collection-create'){
          console.log(this.listPermission[j])
          this.collectioncreate = true;
          
        }
      }
    })
  }
  getPremiumData(page){
    this.httpclient.get<any>(`${this.Api_Http}/pfcollections?pages=${page}`, { headers: this.headers }).subscribe(res=>{
      console.log(res)
      this.collectiondetails = res['data'];
      this.collectionSize = res['total'];
      this.dtTrigger.next();
      this.ngOnDestroy();
    })
     console.log( page)
   }
  myFileName = "my-custom-file.pdf";
  fileUrl = "";

  // ---------------create collection------------
  cash1;
  cheque1;
  cash2;
  cheque;
  pfaccno;
  colbranchs;
  colamount;
  productForm: FormGroup;
  error_collection_amount;
  yeardate;
  es;
  yeardates;
  getcurrentmonth;
  userdate;
  isUserDateValid;
  isUserDateValidmessage;
  errormessage;
  getyear;
  endyear;
  collectionbankaccnos;

  getCollectionAccoutByBranchIds = "";
  changecomAccNo = "";
  companyaccountno;
  get_col_month;
  get_col_year;
  get_col_amount;
  getcolyear;
  get_col_months;
  companyacno;
  sid = this.route.snapshot.params["id"];
  pdftable;
  downloadform;
  storeurls;
  save;
  collectiontype;
  get registerFormControl() {
    return this.productForm.controls;
  }
  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  start() {
    this.isLoading = true;
    this.wait(2000).then(() => (this.isLoading = false));
  }
  private changeCompanyAccNo = async () => {
    this.save = true;
    this.companyacno = true;
    this.companyaccountno = this.changecomAccNo;
    if (this.companyaccountno != null) {
      await this.collection
        .getCollectionByCpmpanyId(this.changecomAccNo)
        .subscribe(
          (res) => {

            this.get_col_months =
              parseInt(res["pf_collection_for_the_month"]) + 1;
            this.get_col_month = JSON.stringify(this.get_col_months);
            if (this.get_col_month === "13") {
              this.get_col_months = parseInt(this.get_col_month) - 12;
              this.get_col_month = JSON.stringify(this.get_col_months);
            }
            let row2 = this.productForm.get('pf_collection_for_the_month');
            let row3 = this.productForm.get('pf_collection_for_the_year');
            let row4 = this.productForm.get('pf_collection_amount');
            if(this.get_col_months === 1){
              let year = parseInt(res["pf_collection_for_the_year"])+1
              row4.patchValue(parseFloat(res['pf_collection_amount']).toFixed(2));
              row3.patchValue(year);
              row2.patchValue(this.get_col_month);
            }else{
              row4.patchValue(parseFloat(res['pf_collection_amount']).toFixed(2));
              row3.patchValue(res["pf_collection_for_the_year"]);
              row2.patchValue(this.get_col_month);
            }
           
          },
      
        );
    }
  };

  private datechange = async (event) => {
    let date = new Date();
    this.getcurrentmonth = date.getMonth() + 1;
    this.getyear = date.getFullYear();

    this.endyear = event.target.value;

    this.endyear = this.endyear.slice(0, -3 - 3);
    this.userdate = event.target.value;
    this.userdate = this.userdate.slice(5, 0 - 3);

    this.isUserDateValidmessage = "Date is invalid";
    this.errormessage = true;

    if (this.getyear == this.endyear) {
      if (this.getcurrentmonth == this.userdate) {
        this.isUserDateValid = true;
        this.errormessage = false;
        this.isUserDateValidmessage = "";
      } else {
      }
    }
  };
  get_Col_year = [
    {'year': '2012'},
    {'year': '2013'},
    {'year': '2014'},
    {'year': '2015'},
    {'year': '2016'},
    {'year': '2017'},
    {'year': '2018'},
    {'year': '2019'},
    {'year': '2020'},
    {'year': '2021'},
    {'year': '2022'},
    {'year': '2023'},
    {'year': '2024'},
    {'year': '2025'},
    {'year': '2026'},
    {'year': '2027'},
    {'year': '2028'},
    {'year': '2029'},
    {'year': '2030'},
    {'year': '2031'},
    {'year': '2032'},
    {'year': '2033'},
    {'year': '2034'},
    {'year': '2035'},
    {'year': '2036'},
    {'year': '2037'},
    {'year': '2038'},
    {'year': '2039'},
    {'year': '2040'},
    {'year': '2041'},
    {'year': '2042'},
    {'year': '2043'},
    {'year': '2044'},
    {'year': '2045'},
    {'year': '2046'},
    {'year': '2047'},
    {'year': '2048'},
    {'year': '2049'},
    {'year': '2050'},
   
  ]

  // private onchange = (e) => {
  //   console.log(e.target.value);
  //   this.yeardate = e.target.value;
  //   this.yeardates = this.yeardate.slice(0, -3);
  // };

  private collectionbankaccno = async () => {
    await this.masterservice.getAccountTypeDetails().subscribe((res) => {
      this.collectionbankaccnos = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    });
  };
  transationalDetail(): FormArray {
    return this.productForm.get("transationalDetail") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      accountTransactionMode: new FormControl("", [Validators.required]),
      accountVoucherAmount: new FormControl("", [Validators.required]),
      accountChequeDate: new FormControl(""),
      accountCollectionInstrumentNo: new FormControl(""),
      accountCollectionBank: new FormControl(""),
    });
  }

  months = [
    { value: "1", month: " January" },
    { value: "2", month: " February" },
    { value: "3", month: " March" },
    { value: "4", month: " April" },
    { value: "5", month: " May" },
    { value: "6", month: " June" },
    { value: "7", month: " July" },
    { value: "8", month: " August" },
    { value: "9", month: " September" },
    { value: "10", month: " October" },
    { value: "11", month: " November" },
    { value: "12", month: " December" },
  ];

  addQuantity() {
    this.transationalDetail().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.transationalDetail().removeAt(i);
  }
  private getCollectionAccoutByBranchId = async () => {
    console.log(this.getCollectionAccoutByBranchIds);

    if (this.getCollectionAccoutByBranchIds != null) {
      await this.collection
        .getCollectionAccoutByBranchId(this.getCollectionAccoutByBranchIds)
        .subscribe((res) => {
          this.collectionbankaccnos = res;
        });
    } else {
      this.collectionbankaccnos = "";
    }
  };
  submitted;
  savedData;
  onSubmit = async () => {
    console.log(this.productForm.value)
    this.save = true;

    if (this.productForm.invalid) {
      this.submitted = true;
      return;
    }
    if (
     
      this.productForm.value.transationalDetail.length == 1
    ) {
      if (
        this.productForm.value.transationalDetail[0].accountVoucherAmount !=
        parseFloat(this.productForm.value.pf_collection_amount)
      ) {
        this.tosatr.warning(
          "Collection amount and transaction amount is not equal"
        );
        return;
      } else {
        this.saveCollection();
      }
    } else if (
      this.productForm.value.transationalDetail.length == 2
    ) {
      if (
        this.productForm.value.transationalDetail[0].accountVoucherAmount +
          this.productForm.value.transationalDetail[1].accountVoucherAmount !=
          parseFloat(this.productForm.value.pf_collection_amount)
      ) {
        this.tosatr.warning(
          "Collection amount and transaction amount is not equal"
        );
        return;
      } else {
        this.saveCollection();
      }
    } else {
      this.tosatr.warning("Field are invalid");
    }
  };
  async saveCollection() {
    this.submitted = false;
    this.isLoading = true;
    // this.savedData = true

    if (this.productForm.value.collection_type == "PF Collection") {
      await this.collection.createPfCollectionDetails(this.productForm.value).subscribe(
          (res) => {
            if (res["message"] != "success") {
              this.tosatr.error(res["message"]);
            } else {
              this.tosatr.success(res["message"]);
              this.getCollectionDetails();
              this.myModal.hide();
            }
            this.isLoading = false;
            this.savedData = false;
          },
          (error) => {
            this.savedData = false;
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else if(this.productForm.value.collection_type == "GF Collection"){
      await this.gfcollection.createPfCollectionDetails(this.productForm.value).subscribe( (res) => {
        this.submitted = false;
            if (res["message"] != "success") {
              this.tosatr.error(res["message"]);
       
            } else {
              this.tosatr.success(res["message"]);
              this.getCollectionDetails();
           
              this.myModal.hide();
            }

            this.isLoading = false;
            this.savedData = false;
          }, (error) => {
            this.savedData = false;
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    }else{
      this.isLoading = false;
      this.tosatr.warning("Collection Bussiness Type is Required");
      this.submitted = true;
      return;
    }
  }
  collectionmode = [{ collectionmodes: "Cash" }, { collectionmodes: "Cheque" }];
  changeCollection = (event, i) => {
    if (event.target.value === "Cash" && i == 0) {
      this.cash1 = true;
      this.cheque = false;
    } else if (event.target.value === "Cheque" && i === 0) {
      this.cash1 = true;
      this.cheque = true;
    } else if (event.target.value === "Cheque" && i === 1) {
      this.cash2 = true;
      this.cheque1 = true;
    } else if (event.target.value === "Cash" && i === 1) {
      this.cash2 = true;
      this.cheque1 = false;
    }
  };

  private getPfCompanyAccNo = async () => {
    this.isLoading = true;
    await this.pfservice.PFcompaneyRegistrationList().subscribe(
      (res) => {
        if(res['success']) {this.pfaccno= res['data'];}
        this.isLoading = false;
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  };
  private getCollectionBranch = async () => {
    await this.colbranch.getBranchlist().subscribe((res) => {
      console.log(res)
      this.colbranchs = res['data'];
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    });
  };
  private downloadCollectionReport = () => {
    this.sid = this.route.snapshot.params["id"];
    const url = this.routes.serializeUrl(
      this.routes.createUrlTree([this.downloadform])
    );
  };

  selectedSimpleItem = [];
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.org_name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.company_account_no.toLocaleLowerCase().indexOf(term) > -1
    );
  }
  collectionType = [
    { 'collection': "PF Collection" },
    { 'collection': "GF Collection" },
  ];

  changeCollectionType() {
    if (
      this.productForm.value.collection_type == "PF Collection"
    ) {
      this.getPfCompanyAccNo();
    } else {
      this.getGFCompanyAccNo();
    }
  }

  private getGFCompanyAccNo = async () => {
    this.isLoading = true;
    await this.company.PFcompaneyRegistrationList().subscribe(
      (res) => {
        this.pfaccno = res['data'];
        this.isLoading = false;
        this.getCollectionBranch();
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  };
  reverseCollection;
  getData;
  isDissabled
  async reversedCollection(collection_id) {
    this.isLoading = true;
    this.reverseCollection = true;
    this.reverseFormControl();
    await this.collection.reversedColBycolId(collection_id).subscribe(
      (res) => {
        this.isDissabled = true;
        this.getData = res;
        this.getCollectionBranch();
        this.myModals.show();
        if (this.getData.length > 0) {
        
          if (res[0].registration_type === "PF") {
            this.getPfCompanyAccNo();
          } else {
            this.getGFCompanyAccNo();
          }

          this.get_col_months = parseInt(res[0].pf_collection_for_the_month);
         

          this.isLoading = false;
          if (res[0].col_acct_trs_reverse_data.length == 1) {
            this.newQuantitys();
            if (
              res[0].col_acct_trs_reverse_data[0].account_transaction_mode ==
              "Cash"
            ) {
              this.cheque = false;
            } else {
              this.cheque = true;
            }
          } else {
            for (let i = 0; i < res[0].col_acct_trs_reverse_data.length; i++) {
              this.newQuantitys();
              if (
                res[0].col_acct_trs_reverse_data[i].account_transaction_mode ==
                "Cash"
              ) {
                if (
                  i == 0 &&
                  res[0].col_acct_trs_reverse_data[i]
                    .account_transaction_mode == "Cash"
                ) {
                  this.cheque = false;
                  this.cheque1 = true;
                } else {
                  this.cheque = true;
                  this.cheque1 = false;
                }
              } else {
                if (
                  i == 0 &&
                  res[0].col_acct_trs_reverse_data[i]
                    .account_transaction_mode == "Cheque"
                ) {
                  this.cheque = true;
                  this.cheque1 = false;
                } else {
                  this.cheque = false;
                  this.cheque1 = true;
                }
              }
            }
          }
          
          this.reverseColForm = this.fb.group({
            collection_type: new FormControl(res[0].registration_type, [
              Validators.required,
            ]),
            pf_collection_id: new FormControl(res[0].pf_collection_id),
            pf_collection_date: new FormControl(res[0].pf_collection_date, [
              Validators.required,
            ]),
            pf_collection_for_the_month: new FormControl(
              res[0].pf_collection_for_the_month,
              [Validators.required]
            ),
            pf_collection_for_the_year: new FormControl(res[0]['pf_collection_for_the_year']),
            pf_collection_amount: new FormControl(res[0].pf_collection_amount, [
              Validators.required,
            ]),
            col_reverse_remarks: new FormControl('',
              [Validators.required]
            ),
            pf_collection_company_account_no_id: new FormControl(
              res[0].pf_collection_company_account_no_id
            ),
            pf_collection_branch_id: new FormControl(
              parseInt(res[0].pf_collection_branch_id),
              [Validators.required]
            ),
            pf_collection_bank_account_no: new FormControl(""),
            transationalDetails: this.fb.array(
              res[0].col_acct_trs_reverse_data.map((datum) =>
                this.generateDatumFormGroup(datum)
              )
            ),
          });
          this.isLoading = false;
          this.savedData = false;
        } else {
          this.myModals.hide();
          this.tosatr.warning("Failed to Reversed Approved status data");
          this.isLoading = false;
        }
      },
      (error) => {
        this.savedData = false;
        this.isLoading = false;
        this.isDissabled = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }

  transationalDetails(): FormArray {
    return this.reverseColForm.get("transationalDetails") as FormArray;
  }

  newQuantitys(): FormGroup {
    return this.fb.group({
      accountTransactionMode: new FormControl("", [Validators.required]),
      accountVoucherAmount: new FormControl("", [Validators.required]),
      accountChequeDate: new FormControl(""),
      accountCollectionInstrumentNo: new FormControl(""),
      accountCollectionBank: new FormControl(""),
    });
  }
  addQuantitys() {
    this.transationalDetails().push(this.newQuantitys());
  }

  private generateDatumFormGroup(datum) {
    console.log(datum.account_transaction_mode);

    return this.fb.group({
      accountTransactionMode: this.fb.control({
        value: datum.account_transaction_mode,
        disabled: false,
      }),
      accountVoucherAmount: this.fb.control({
        value: datum.account_voucher_amount,
        disabled: false,
      }),
      accountChequeDate: this.fb.control({
        value: datum.account_cheque_date,
        disabled: false,
      }),
      accountCollectionInstrumentNo: this.fb.control({
        value: datum.account_collection_instrument_no,
        disabled: false,
      }),
      accountCollectionBank: this.fb.control({
        value: datum.account_collection_bank,
        disabled: false,
      }),
    });
  }

  async saveReversedCollection() {
    this.isLoading = true;
      await this.collection.saveReversedCollection(this.reverseColForm.value).subscribe((res) => {
        this.isLoading = false;
        if (res[0] == "success") {
          this.tosatr.success(res["message"]);
          this.getCollectionDetails();
          this.myModals.hide();
        } else {
          this.tosatr.error(res["message"]);
        }
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }
  async generateMoneyReceipt(pf_collection_id) {
    this.isLoading = true;
    await this.collection.generateCollectionReport(pf_collection_id).subscribe((res) => {
      console.log(res)
      this.isLoading = false;
        let blob: any = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        open(url);
        this.getCollectionDetails();
    },
    (error) => {
      console.log(error)
      this.isLoading = false;
    }
  );
  }

  removeQuantitys(i: number) {
    this.transationalDetails().removeAt(i);
  }

  get registerFormControlReversed() {
    return this.reverseColForm.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
