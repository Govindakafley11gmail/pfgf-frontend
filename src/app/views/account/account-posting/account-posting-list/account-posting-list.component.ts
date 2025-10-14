import { Component, OnInit, ViewChild } from "@angular/core";
import { PfemployeeService } from "../../../_service/pfemployee/pfemployee.service";
import { PfserviceService } from "../../../_service/pf/pfservice.service";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-account-posting-list",
  templateUrl: "./account-posting-list.component.html",
  styleUrls: ["./account-posting-list.component.scss"],
})
export class AccountPostingListComponent implements OnInit {
  findAllAccountPosting: any;
    dtTrigger: Subject<any> = new Subject<any>();
    // dtOptions: DataTables.Settings = {};
    dtOptions: any = {}; // Now Angular will recognize it
    transaction_id:string;
    @ViewChild('myModals') public myModals: ModalDirective;
   accountposting: FormGroup;
    datatableElement: any = DataTableDirective;
  constructor(
    private employee: PfemployeeService,
    private pfservice: PfserviceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPaymentData();
    this.accountposting = this.fb.group({
      account_transaction_id: [""],
    })
  }

  loadPaymentData() {
    this.employee.getAccountPostingList().subscribe((res) => {
      this.findAllAccountPosting = res;
     this.dtTrigger.next();

    });
  }

  downloadAccountVoucher(path) {
    this.pfservice.downloadRefundFile(path).subscribe(
      (res) => {
        let blob: any = new Blob([res], {
          type: "application/" + path.split(".").pop(),
        });
        const url = window.URL.createObjectURL(blob);
        open(url);
      },
      (error) => {}
    );
  }
  reverdedTransaction(){
    // Logic for reverting the transaction
        console.log('Reversing account voucher for transaction ID:', this.accountposting.value.account_transaction_id);

    this.pfservice.revertAccountTransaction(this.accountposting.value).subscribe(
      (res) => {
        this.toastr.success("Transaction reverted successfully");
        this.loadPaymentData(); // Reload the data after reverting
        this.myModals.hide();
      },
      (error) => {
        this.toastr.error("Failed to revert transaction");
      }
    );
  }

  reversedAccountVoucher(transactionId: string) {
    console.log('Reversing account voucher for transaction ID:', transactionId);
     this.accountposting.patchValue({
      account_transaction_id: transactionId,
    });
    this.myModals.show();
  }

}
