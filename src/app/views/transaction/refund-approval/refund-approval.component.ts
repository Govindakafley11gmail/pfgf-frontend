import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { Refund, RefundService, RefundStatus } from '../../_service/refunds.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-refund-approval',
  templateUrl: './refund-approval.component.html',
  styleUrls: ['./refund-approval.component.scss']
})
export class RefundApprovalComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal!: ModalDirective;

  approvedorpendind: any[] = [];

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isLoading = false;
  processing = false;

  selectedRefunds: any[] = [];
  userRefundApproved = false;

  // Placeholder until listpermission() resolves and sets the real value
  // based on the user's actual permissions (loan-approval vs committee).
  statusFilter: any;
  selectedFile: File | null = null;

  formarray: FormGroup = new FormGroup({
    refund_approved_remarks: new FormControl('')
  });

  approvedData: FormGroup = this.fb.group({
    registration_type: [''],
    total_employee_contribution: [0],
    total_employer_contribution: [0],
    total_interest_on_employee_contribution: [0],
    total_interest_on_employer_contribution: [0],
    total_contribution: [0],
    total_interest: [0],
    prev_total_disbursed_amount: [0],
    gross_refundable_amount: [0],
    net_refundable_amount: [0],
    org_name: [''],
    employee_name: [''],
    comp_acc_no: [''],
    emp_acc_no: [''],
    refund_ref_no: [''],
    reg_branch_id: [''],
    refund_company_id: [''],
    refund_processing_date: [''],
    refund_employee_cid: [''],
    refund_employee_id: [''],
    refund_employee_contribution: [0],
    refund_employer_contribution: [0],
    refund_interest_on_employee_contr: [0],
    refund_interest_on_employer_contr: [0],
    refund_total_contr: [0],
    refund_as_on_interest_employee: [0],
    refund_as_on_interest_employer: [0],
    refund_total_interest: [0],
    refund_total_disbursed_amount: [0],
    refund_net_refundable: [0],
    refund_file_name: [''],
    refund_processed_remarks: [''],
    loan_remarks : [''],
    refund_committee_remarks: ['']
  });

  dataToApproved: any;
  employeeData: any;
  companyData: any;
  lastTransaction: any;

  Supporting: boolean = false;
  refundslipdocument: boolean = false;
  refundslipdocument2: boolean = false;
  downloadfile!: string;
  downloadfile2!: string;
  downloadfile3!: string;

  // ---- Permissions ----
  listPermission: string[] = [];
  loanapproval: boolean = false;
  committee: boolean = false;
  constructor(
    private refundService: RefundService,
    private user: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // Load permissions FIRST, then decide what to fetch based on them.
    this.listpermission();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  listpermission(): void {
    this.isLoading = true;
    this.user.editAllUserWithoutAuth(parseInt(localStorage.getItem('id') || '0', 10)).subscribe({
      next: (res: any) => {
        this.listPermission = res['user-permissions-list'].map((p: any) => p.name);

        this.loanapproval = this.listPermission.includes('loan-approval');
        this.committee = this.listPermission.includes('committee');

        // Loan-approval works the pending queue; committee reviews what's already approved.
        if (this.loanapproval) {
          this.statusFilter = 'loan-approval';
        } else if (this.committee) {
          this.statusFilter = 'loan_approved'; // match whatever status name loan-approval sets on approve
        }

        this.loadPendingRefunds();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadPendingRefunds(): void {
    this.isLoading = true;
    this.refundService.getRefunds(this.statusFilter).subscribe({
      next: (data: any) => {
        this.approvedorpendind = data;
        this.isLoading = false;
        this.dtTrigger.next();
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  // Badge helper for the committee's "loan-approval status" column
  getApprovalBadgeClass(pending: any): string {
    switch (pending.refund_status) {
      case 'Approved': return 'badge badge-success';
      case 'Rejected': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }



  postApprovalData(): void {

    console.log('Submitting approval data:', this.approvedData.value);
    this.isLoading = true;
    this.refundService.approveRefund(this.approvedData.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.myModal.hide();
        this.loadPendingRefunds();
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  ToBeApprovedListByredunfRefNos(refund_ref_no: string): void {
    this.isLoading = true;

    this.refundService.getRefundsByRefNo(refund_ref_no).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.myModal.show();

        this.dataToApproved = res[0];
        this.employeeData = res[0].pf_refund_employee;
        this.companyData = res[0].company_details;
        this.lastTransaction = res[0].refund_transaction_data;

        this.Supporting = false;
        this.refundslipdocument = false;
        this.refundslipdocument2 = false;

        const docs = res[0].refund_processed_upload_docs ?? [];
        if (docs.length === 3) {
          this.Supporting = true;
          this.refundslipdocument = true;
          this.refundslipdocument2 = true;
          this.downloadfile = docs[0].doc_path;
          this.downloadfile2 = docs[1].doc_path;
          this.downloadfile3 = docs[2].doc_path;
        } else if (docs.length === 2) {
          this.refundslipdocument = true;
          this.refundslipdocument2 = true;
          this.downloadfile2 = docs[0].doc_path;
          this.downloadfile3 = docs[1].doc_path;
        } else if (docs.length === 1) {
          this.refundslipdocument = true;
          this.downloadfile2 = docs[0].doc_path;
        }

        const employeeContribution = parseFloat(this.lastTransaction?.['total_employee_contribution']) || 0;
        const employerContribution = parseFloat(this.lastTransaction?.['total_employer_contribution']) || 0;
        const employeeInterest = parseFloat(this.lastTransaction?.['total_interest_on_employee_contribution']) || 0;
        const employerInterest = parseFloat(this.lastTransaction?.['total_interest_on_employer_contribution']) || 0;
        const prevDisbursed = parseFloat(this.lastTransaction?.['prev_total_disbursed_amount']) || 0;

        this.approvedData.patchValue({
          registration_type: res[0].registration_type,
          total_employee_contribution: employeeContribution,
          total_employer_contribution: employerContribution,
          total_interest_on_employee_contribution: Math.round(employeeInterest * 100) / 100,
          total_interest_on_employer_contribution: Math.round(employerInterest * 100) / 100,
          total_contribution: employeeContribution + employerContribution,
          total_interest: Math.round((employeeInterest + employerInterest) * 100) / 100,
          prev_total_disbursed_amount: Math.round(prevDisbursed * 100) / 100,
          gross_refundable_amount:
            Math.round((employeeContribution + employerContribution + employeeInterest + employerInterest) * 100) / 100,
          net_refundable_amount:
            Math.round(((employeeContribution + employerContribution + employeeInterest + employerInterest) - prevDisbursed) * 100) / 100,
          org_name: this.companyData?.['org_name'],
          employee_name: this.employeeData?.['employee_name'],
          comp_acc_no: this.employeeData?.['company_pf_acc_no'],
          emp_acc_no: this.employeeData?.['pf_emp_acc_no'],
          refund_ref_no: this.dataToApproved['refund_ref_no'],
          reg_branch_id: this.dataToApproved['reg_branch_id'],
          refund_company_id: this.dataToApproved['pf_employee_company_id'],
          refund_processing_date: this.dataToApproved['refund_processing_date'],
          refund_employee_cid: this.employeeData?.['identification_no'],
          refund_employee_id: this.employeeData['pf_employee_id'],
          refund_employee_contribution: this.dataToApproved['refund_employee_contribution'],
          refund_employer_contribution: this.dataToApproved['refund_employer_contribution'],
          refund_interest_on_employee_contr:
            Math.round(parseFloat(this.dataToApproved['refund_interest_on_employee_contr']) * 100) / 100,
          refund_interest_on_employer_contr:
            Math.round(parseFloat(this.dataToApproved['refund_interest_on_employer_contr']) * 100) / 100,
          refund_total_contr: this.dataToApproved['refund_total_contr'],
          refund_as_on_interest_employee:
            Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employee']) * 100) / 100,
          refund_as_on_interest_employer:
            Math.round(parseFloat(this.dataToApproved['refund_as_on_interest_employer']) * 100) / 100,
          refund_total_interest:
            Math.round(parseFloat(this.dataToApproved['refund_total_interest']) * 100) / 100,
          refund_total_disbursed_amount:
            Math.round(parseFloat(this.dataToApproved['refund_total_disbursed_amount']) * 100) / 100,
          refund_net_refundable:
            Math.round(parseFloat(this.dataToApproved['refund_net_refundable']) * 100) / 100,
          refund_file_name: this.dataToApproved['refund_file_name'],
          refund_processed_remarks: this.dataToApproved['refund_processed_remarks'],
          loan_remarks : this.dataToApproved['loan_remarks'],
          refund_committee_remarks: ['']
        });
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

}