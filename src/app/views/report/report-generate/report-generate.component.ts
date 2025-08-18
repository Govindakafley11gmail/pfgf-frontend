import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CollectionService } from "../../_service/collection/collection.service";
import { GfcollectionService } from "../../_service/GF-API/gfcollection.service";
import { PfserviceService } from "../../_service/pf/pfservice.service";
import { PfemployeeService } from "../../_service/pfemployee/pfemployee.service";
import { UserService } from "../../_service/user.service";
import { MasterService } from "../../_service/master/master.service";
import { saveAs } from "file-saver";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { Subject } from "rxjs";
import { CompanyService } from "../../_service/GF-API/company.service";
import { EmployeeService } from "../../_service/GF-API/employee.service";
import { AppSidebarFooterComponent } from "@coreui/angular/lib/sidebar/app-sidebar-footer.component";

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY",
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    monthYearA11yLabel: "YYYY",
  },
};
@Component({
  selector: "app-report-generate",
  templateUrl: "./report-generate.component.html",
  styleUrls: ["./report-generate.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})
export class ReportGenerateComponent implements OnInit, OnDestroy {
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  generatereport;
  report: FormGroup;
  dailycollectionCondition;
  companyName;
  employeeid;
  companyid;
  employeeName;
  accountLedgerReport;
  companyeewise;
  generateReport;
  submitted;
  viewReports;
  tableView;
  date;
  monthAndYear;
  collectionofMonths;

  viewallreport;
  // gfemployee
  constructor(
    private gfemployee: EmployeeService,
    private gfcompanyDetails: CompanyService,
    private gfcollection: GfcollectionService,
    private tosatr: ToastrService,
    private collection: CollectionService,
    private fb: FormBuilder,
    private pfservice: PfserviceService,
    private master: UserService,
    private pfemployee: PfemployeeService,
    private masterservice: MasterService
  ) {}

  ngOnInit(): void {
    this.formdata = true;
    this.viewallreport = false;
    this.date = true;
    this.generateReport = true;
    this.generateReportFormControl();
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

  get_Col_year = [
    { year: "2012" },
    { year: "2013" },
    { year: "2014" },
    { year: "2015" },
    { year: "2016" },
    { year: "2017" },
    { year: "2018" },
    { year: "2019" },
    { year: "2020" },
    { year: "2021" },
    { year: "2022" },
    { year: "2023" },
    { year: "2024" },
    { year: "2025" },
    { year: "2026" },
    { year: "2027" },
    { year: "2028" },
    { year: "2029" },
    { year: "2030" },
    { year: "2031" },
    { year: "2032" },
    { year: "2033" },
    { year: "2034" },
    { year: "2035" },
    { year: "2036" },
    { year: "2037" },
    { year: "2038" },
    { year: "2039" },
    { year: "2040" },
    { year: "2041" },
    { year: "2042" },
    { year: "2043" },
    { year: "2044" },
    { year: "2045" },
    { year: "2046" },
    { year: "2047" },
    { year: "2048" },
    { year: "2049" },
    { year: "2050" },
  ];

  monthly_refund = [{ refund: "Monthly Refund" }, { refund: "Excess Refund" }];
  status = [{ status: "Active" }, { status: "Closed" }];
  reportType = [{ reportname: "PDF" }, { reportname: "Excel" }];

  ReportWiseName = [
    { reportname: "Daily collection Report", value: "DailyColStatement" },
    { reportname: "Employee wise Statement", value: "EmpWiseStatement" },
    { reportname: "Company wise Statement", value: "CmpWiseStatement" },
    {
      reportname: "Remittance & Deposit Statement",
      value: "MonthlyDepositStatement",
    },
    { reportname: "Account ledger Report", value: "AccountLedgerStatement" },
    { reportname: "Trial balance Report", value: "TrialBalanceStatement" },
    { reportname: "MOU Renewal List Report", value: "MouRenewalList" },
    {
      reportname: "Company Wise fund balance Report",
      value: "CompanyWiseFundBalance",
    },
    { reportname: "Monthly Refund Report", value: "MonthlyRefundReport" },
    { reportname: "Monthly Labour Statement", value: "MonthlyLabourStatement" },
    { reportname: "Monthly Closing Report", value: "ClosingReport" },
    { reportname: "BRM Report", value: "BrmReport" },

    { reportname: "MOU Lapsed Report", value: "companyListWithLapsedReport" },
    { reportname: "Introducer Report", value: "companyListWithintroducerReport" },
    { reportname: "InActive Employee Report", value: "inActiveEmployeeList" },
    { reportname: "Monthly Refund Pending Report", value: "monthlyRefundPendingReport" },
    { reportname: "New Company Report", value: "newcompanyListReport" },
    {
      reportname: "Company Wise Remittance Follow-Up Report",
      value: "CompanyWiseRemittanceDueReport",
    },
  ];
  documentTypes = [
    { label: "PDF", value: "PDF" },
    { label: "HTML", value: "HTML" },
  ];

  employeewise;
  monthlydeposit;
  branchName;
  excessref;
  isstatus:boolean=false
  getReportCategory() {
    if (this.report.value.report_name == "DailyColStatement") {
      this.dailyColletionFormControl(this.report.value.report_name);

      this.dailycollectionCondition = true;
      this.accountLedgerReport = false;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    } else if (this.report.value.report_name == "EmpWiseStatement") {
      this.employeeWiseFormControl(this.report.value.report_name);

      this.employeewise = true;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
      this.excessref = false;
    } else if (this.report.value.report_name == "inActiveEmployeeList") {
      this.employeeWiseFormControl(this.report.value.report_name);
      this.employeewise = false;
      this.isstatus = false
      this.accountLedgerReport = false;
      this.dailycollectionCondition = true;
      this.employeewise = false;
      this.companyeewise = false;
      this.monthlydeposit = false;
      this.monthAndYear = false;
      this.date = true;
    }
     else if (this.report.value.report_name == "monthlyRefundPendingReport") {
      this.employeeWiseFormControl(this.report.value.report_name);
      this.employeewise = false;
      this.isstatus = false
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.employeewise = false;
      this.companyeewise = false;
      this.monthlydeposit = false;
      this.monthAndYear = false;
      this.date = true;
      this.excessref=true;
    }
    else if (this.report.value.report_name == "newcompanyListReport") {
      this.employeeWiseFormControl(this.report.value.report_name);
      this.getBranchName();
      this.employeewise = false;
      this.isstatus = false
      this.dailycollectionCondition=true;
      this.accountLedgerReport = false;
      this.employeewise = false;
      this.companyeewise = false;
      this.monthlydeposit = false;
      this.monthAndYear = false;
      this.date = true;
      this.excessref=false;
    }
    else if (this.report.value.report_name == "companyListWithintroducerReport") {
        this.dailyColletionFormControl(this.report.value.report_name);
         this.dailycollectionCondition = true;
      this.accountLedgerReport = false;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    }
    
     else if (this.report.value.report_name == "CmpWiseStatement") {
      this.companyWiseReport(this.report.value.report_name);
      this.employeewise = false;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.employeewise = false;
      this.companyeewise = true;
      this.monthlydeposit = false;
      this.monthAndYear = false;
      this.date = true;
    } 
     else if (this.report.value.report_name == "MonthlyDepositStatement") {
      this.formdata = true;
      this.monthlyDepositFormControl(this.report.value.report_name);

      this.employeewise = false;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.monthlydeposit = true;
      this.companyeewise = false;
      this.monthAndYear = true;
      this.date = false;
    } else if (this.report.value.report_name == "AccountLedgerStatement") {
      this.formdata = true;
      this.accountLedgerFormControl(this.report.value.report_name);

      this.dailycollectionCondition = false;
      this.accountLedgerReport = true;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    } else if (this.report.value.report_name == "TrialBalanceStatement") {
      this.formdata = true;
      this.dailyColletionFormControl(this.report.value.report_name);

      this.dailycollectionCondition = true;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.accountLedgerReport = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    } else if (this.report.value.report_name == "MouRenewalList") {
      this.formdata = true;
      this.dailyColletionFormControl(this.report.value.report_name);

      this.dailycollectionCondition = true;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.accountLedgerReport = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    } else if (this.report.value.report_name == "CompanyWiseFundBalance") {
      this.formdata = true;
      this.companyWiseReport(this.report.value.report_name);

      this.employeewise = false;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.employeewise = false;
      this.companyeewise = true;
      this.monthlydeposit = false;
      this.monthAndYear = false;
      this.date = true;
    }
     else if (this.report.value.report_name == "CompanyWiseRemittanceDueReport") {
      this.dailyColletionFormControl(this.report.value.report_name);

      this.employeewise = false;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
      this.excessref = false;
    }
     else if (this.report.value.report_name == "MonthlyRefundReport") {
      this.employeeWiseFormControl(this.report.value.report_name);

      this.employeewise = true;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
      this.excessref = true;
    } else if (this.report.value.report_name == "MonthlyLabourStatement") {
      this.formdata = true;
      this.monthlyDepositFormControl(this.report.value.report_name);

      this.employeewise = false;
      this.accountLedgerReport = false;
      this.dailycollectionCondition = false;
      this.monthlydeposit = true;
      this.companyeewise = false;
      this.monthAndYear = true;
      this.date = false;
    } else if (this.report.value.report_name == "ClosingReport") {
      this.formdata = true;
      this.dailyColletionFormControl(this.report.value.report_name);

      this.dailycollectionCondition = false;
      this.accountLedgerReport = false;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    } else if (this.report.value.report_name == "BrmReport") {
      this.formdata = true;
      this.dailyColletionFormControl(this.report.value.report_name);

      this.dailycollectionCondition = false;
      this.accountLedgerReport = false;
      this.employeewise = false;
      this.monthlydeposit = false;
      this.companyeewise = false;
      this.monthAndYear = false;
      this.date = true;
    }
  }

  generateReportFormControl() {
    this.report = this.fb.group({
      registration_type: new FormControl(""),
      report_name: ["", Validators.required],
      report_type: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      doc_type: [""],
    });
  }
  mouReportFormControl(report_name) {
    this.report = this.fb.group({
      registration_type: new FormControl(""),
      report_name: [report_name, Validators.required],
      report_type: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      doc_type: [""],
    });
  }

  dailyColletionFormControl(repostname) {
    this.report = this.fb.group({
      registration_type: new FormControl(""),
      report_name: [repostname],
      report_type: [""],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      branch_id: [""],
      doc_type: [""],
    });
    this.getBranchName();
  }

  accountLedgerFormControl(reportname) {
    this.report = this.fb.group({
      report_name: [reportname],
      registration_type: new FormControl(""),
      report_type: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      branch_id: [""],
      account_group_id: ["", [Validators.required]],
      account_type_id: [""],
      company_id: ["", [Validators.required]],
      employee_id: ["", [Validators.required]],
      doc_type: [""],
    });
    this.getBranchName();
    this.accountGroup();
    this.accountType();
  }
  accounttype;
  changeGetAccountTypeById() {
    this.masterservice
      .getAccountTypeDetailsBygroupCode(this.report.value.account_group_id)
      .subscribe(
        (res) => {
          console.log(res);
          this.accounttype = res["data"];
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
  }

  formdata;
  monthlyDepositFormControl(reportname) {
    this.formdata = false;
    // this.yeardates = this.yeardate.slice(0, -3);
    this.report = this.fb.group({
      report_name: [reportname],
      registration_type: new FormControl(""),
      report_type: ["", [Validators.required]],
      for_the_month: ["", [Validators.required]],
      for_the_year: ["", [Validators.required]],
      company_id: ["", [Validators.required]],
      doc_type: [""],
    });

    this.getMonth();
  }
  minDate: Date;
  getMonth() {
    this.collection.getAllMonth().subscribe(
      (res) => {
        console.log(res);
        this.collectionofMonths = res;
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
    this.minDate = new Date(1950, 0, 1);
  }

  employeeWiseFormControl(reportname) {
    this.report = this.fb.group({
      report_name: [reportname],
      registration_type: new FormControl(""),
      report_type: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      company_id: [""],
      employee_id: [""],
      employee_cid_no: [""],
      Excess_Payment_Refund: new FormControl(""),
      doc_type: [""],
      status: [""]
    });
  }

  companyWiseReport(reportname) {
    this.report = this.fb.group({
      report_name: [reportname],
      registration_type: new FormControl(""),
      report_type: ["", [Validators.required]],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      company_id: [""],
      doc_type: [""],
    });
  }

  viewreport: FormGroup;
  viewreportFormControl() {
    this.viewreport = this.fb.group({
      registration_type: new FormControl(""),
      report_name: ["", Validators.required],
      report_type: [""],
      from_date: [""],
      to_date: [""],
      doc_type: [""],
    });
  }

  accoungGroupDetails;
  accountTypeDetails;
  accountGroup() {
    this.masterservice.getAccountGroupDetails().subscribe(
      (res) => {
        this.accoungGroupDetails = res["data"];
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }

  accountType() {
    this.masterservice.getAccountTypeDetails().subscribe(
      (res) => {
        this.accountTypeDetails = res;
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }

  getBranchName() {
    this.master.getBranchlist().subscribe(
      (res) => {
        this.branchName = res["data"];
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }

  async getCompanyName() {
    if (this.report.value.registration_type == "PF") {
      this.isLoading = true;
      await this.pfservice.PFcompaneyRegistrationList().subscribe(
        (res) => {
          this.isLoading = false;
          this.companyName = res["data"];
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    } else {
      this.isLoading = true;
      await this.gfcompanyDetails.PFcompaneyRegistrationList().subscribe(
        (res) => {
          this.isLoading = false;
          this.companyName = res["data"];
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
  }
  async gfcompany() {
    await this.gfcompanyDetails.PFcompaneyRegistrationList().subscribe(
      (res) => {
        this.isLoading = false;
        this.companyName = res["data"];
      },
      (error) => {
        this.isLoading = false;
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
      }
    );
  }

  async getcompanyWiseEmployeeName() {
    console.log(this.report.value);
    if (this.report.value.registration_type == "PF") {
      await this.pfservice
        .getByEmployeeName(this.report.value.company_id)
        .subscribe(
          (res) => {
            if (res.length > 0) {
              this.employeeName = res[0].get_employee_details;
            }
          },
          (error) => {
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else {
      await this.gfcompanyDetails
        .getByEmployeeName(this.report.value.company_id)
        .subscribe(
          (res) => {
            if (res.length > 0) {
              this.employeeName = res;
            }
          },
          (error) => {
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    }
  }

  getEmployeeCID() {
    if (this.report.value.registration_type == "PF") {
      this.pfemployee.getPfEmployeeById(this.employeeid).subscribe(
        (res) => {
          this.report
            .get("employee_cid_no")
            .setValue(res[0]["identification_no"]);
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    } else {
      this.gfemployee.getPfEmployeeById(this.employeeid).subscribe(
        (res) => {
          console.log(res);
          this.report
            .get("employee_cid_no")
            .setValue(res[0]["identification_no"]);
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
  }

  viewGeneratedReport() {
    this.viewReports = true;
    this.viewreportFormControl();
    // this.viewreportFormControl(this.report.value.report_name,this.report.value.registration_type)
    this.viewReports = true;
    this.generateReport = false;
    this.monthAndYearView = false;
    this.viewAllOthersReport = true;
  }

  generateAsPDF() {
    this.submitted = true;
    this.pfReport();
  }

  async pfReport() {
    if (this.report.value.report_name == "DailyColStatement") {
      this.isLoading = true;
      await this.collection.dailyCollectionList(this.report.value).subscribe(
        (res) => {
          console.log(this.report.value.report_name);
          this.viewAllreportFormControl(this.report.value.report_name);

          this.report.reset(this.report);
          this.isLoading = false;
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    
       else if (this.report.value.report_name == "newcompanyListReport") {
      this.isLoading = true;
      await this.collection.NewCompanyListReport(this.report.value).subscribe(
        (res) => {
          this.isLoading = false;
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    
       else if (this.report.value.report_name == "CompanyWiseRemittanceDueReport") {
      this.isLoading = true;
      await this.collection.CompanyWiseRemittanceDueReport(this.report.value).subscribe(
        (res) => {
          this.isLoading = false;
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    
     else if (this.report.value.report_name == "monthlyRefundPendingReport") {
      this.isLoading = true;
      await this.collection.monthlyPendingReport(this.report.value).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    else if (this.report.value.report_name == "EmpWiseStatement") {
      this.isLoading = true;
      await this.collection.employeeWiseStatement(this.report.value).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    else if (this.report.value.report_name == "companyListWithintroducerReport") {
      this.isLoading = true;
      await this.collection.companyListWithintroducerReport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
    else if (this.report.value.report_name == "inActiveEmployeeList") {
      this.isLoading = true;
      await this.collection.ActiveOrInactiveEmployeeList(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);

          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
     else if (this.report.value.report_name == "CmpWiseStatement") {
      this.isLoading = true;
      await this.collection.companyWiseStatement(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);

          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    } else if (this.report.value.report_name == "TrialBalanceStatement") {
      this.isLoading = true;
      await this.collection.trialBalanceReport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          console.log(res);
          this.report.reset(this.report);
          this.generateReport = false;

          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    } else if (this.report.value.report_name == "MonthlyDepositStatement") {
      this.isLoading = true;
      console.log(this.report.value);
      await this.collection
        .monthlyDepositReportSearch(this.report.value)
        .subscribe(
          (res) => {
            this.viewAllreportFormControl(this.report.value.report_name);
            this.isLoading = false;
            this.report.reset(this.report);
            this.generateReport = false;
            this.viewAllOthersReport = true;
            if (res[0] == "success") {
              this.tosatr.success(res["message"]);
              this.viewReport();
              this.viewAllOthersReport = true;
              this.viewReports = true;
              this.generateReport = false;
            } else {
              this.viewReports = false;
              this.generateReport = true;
              this.tosatr.error(res["message"]);
            }
          },
          (error) => {
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else if (this.report.value.report_name == "AccountLedgerStatement") {
      this.isLoading = true;
      await this.collection.accLedgerReport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);
          this.generateReport = false;
          this.viewAllOthersReport = true;
          console.log(res);
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
          this.isLoading = false;
        }
      );
    } else if (this.report.value.report_name == "MouRenewalList") {
      this.isLoading = true;
      await this.collection.mouRenewalReport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);
          this.generateReport = false;
          this.viewAllOthersReport = true;
          console.log(res);
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
          this.isLoading = false;
        }
      );
    } else if (this.report.value.report_name == "CompanyWiseFundBalance") {
      this.isLoading = true;
      await this.collection.companyWisefundReport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);

          this.isLoading = false;

          this.generateReport = false;
          this.viewAllOthersReport = true;
          console.log(res);
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
          this.isLoading = false;
        }
      );
    } else if (this.report.value.report_name == "MonthlyRefundReport") {
      this.isLoading = true;
      await this.collection.monthlyRefundreport(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.report.reset(this.report);
          this.isLoading = false;
          this.generateReport = false;
          this.viewAllOthersReport = true;
          console.log(res);
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
          this.isLoading = false;
        }
      );
    } else if (this.report.value.report_name == "MonthlyLabourStatement") {
      this.isLoading = true;
      console.log(this.report.value);
      await this.collection
        .monthlyLabourReportSearch(this.report.value)
        .subscribe(
          (res) => {
            this.viewAllreportFormControl(this.report.value.report_name);
            this.isLoading = false;
            this.report.reset(this.report);
            this.generateReport = false;
            this.viewAllOthersReport = true;
            if (res[0] == "success") {
              this.tosatr.success(res["message"]);
              this.viewReport();
              this.viewAllOthersReport = true;
              this.viewReports = true;
              this.generateReport = false;
            } else {
              this.viewReports = false;
              this.generateReport = true;
              this.tosatr.error(res["message"]);
            }
          },
          (error) => {
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else if (this.report.value.report_name == "ClosingReport") {
      this.isLoading = true;
      console.log(this.report.value);
      await this.collection
        .monthlyClosingReportSearch(this.report.value)
        .subscribe(
          (res) => {
            this.viewAllreportFormControl(this.report.value.report_name);
            this.isLoading = false;
            this.report.reset(this.report);
            this.generateReport = false;
            this.viewAllOthersReport = true;
            if (res[0] == "success") {
              this.tosatr.success(res["message"]);
              this.viewReport();
              this.viewAllOthersReport = true;
              this.viewReports = true;
              this.generateReport = false;
            } else {
              this.viewReports = false;
              this.generateReport = true;
              this.tosatr.error(res["message"]);
            }
          },
          (error) => {
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else if (this.report.value.report_name == "BrmReport") {
      this.isLoading = true;
      console.log(this.report.value);
      await this.collection.BRMReportSearch(this.report.value).subscribe(
        (res) => {
          this.viewAllreportFormControl(this.report.value.report_name);
          this.isLoading = false;
          this.report.reset(this.report);
          this.generateReport = false;
          this.viewAllOthersReport = true;
          if (res[0] == "success") {
            this.tosatr.success(res["message"]);
            this.viewReport();
            this.viewAllOthersReport = true;
            this.viewReports = true;
            this.generateReport = false;
          } else {
            this.viewReports = false;
            this.generateReport = true;
            this.tosatr.error(res["message"]);
          }
        },
        (error) => {
          this.isLoading = false;
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
        }
      );
    }
  }

  viewAllOthersReport;
  monthAndYearView;
  getViewCategory() {
    console.log(this.viewreport.value.report_name);
    if (this.viewreport.value.report_name == "monthlyDepositStatement") {
      this.viewReports = true;
      this.monthAndYearView = true;
      this.viewAllOthersReport = false;
      this.monthlyViewReport(
        this.viewreport.value.report_name,
        this.report.value.registration_type
      );
      this.getMonth();
    } else {
      this.viewReports = true;
      this.monthAndYearView = false;
      this.viewAllOthersReport = true;
      this.viewreportFormControl();
    }
  }

  monthlyViewReport(report_name, registration_type) {
    this.viewreport = this.fb.group({
      registration_type: new FormControl(registration_type),
      report_name: [report_name, Validators.required],
      report_type: [""],
      for_the_month: [""],
      for_the_year: [""],
    });
  }

  collectViewReports;
  resLength;
  async viewReport() {
    if (this.viewreport.invalid) {
      this.submitted = true;
      return;
    } else {
      this.isLoading = true;
      await this.collection
        .viewAllGeneratedReport(this.viewreport.value)
        .subscribe(
          (res) => {
            this.dtTrigger.next();
            this.isLoading = false;
            this.resLength = res;
            if (this.resLength.length > 0) {
              this.collectViewReports = res;
              this.viewReports = true;
              this.tableView = true;
            } else {
              this.tosatr.warning("Failed to View report,Due to No data found");
            }
          },
          (error) => {
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
            this.isLoading = false;
          }
        );
    }
  }

  reportwise;
  viewGeneratedAllReport() {
    if (this.viewreport.value.registration_type == "PF") {
      this.reportwise = true;
    } else {
      this.reportwise = false;
    }
  }
  async downloadGeneratedReports(docPath, doc_name) {
    this.isLoading = true;
    await this.collection.downloadReport(docPath).subscribe(
      (res) => {
        this.isLoading = false;
        if (docPath.split(".").pop() == "html") {
          let blob: any = new Blob([res], {
            type: "text/" + docPath.split(".").pop(),
          });
          const url = window.URL.createObjectURL(blob);
          open(url, docPath);
        } else {
          let blob: any = new Blob([res], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          open(url, " " + doc_name + " " + new Date());
        }
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }

  async viewDownloadableReport(docPath) {
    this.isLoading = true;
    await this.collection.downloadReport(docPath).subscribe(
      (res) => {
        this.isLoading = false;
        if (docPath.split(".").pop() == "html") {
          let blob: any = new Blob([res], {
            type: "text/" + docPath.split(".").pop(),
          });
          const url = window.URL.createObjectURL(blob);
          open(url, docPath);
        } else {
          let blob: any = new Blob([res], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          open(url);
        }
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }

  back() {
    this.generateReportFormControl();
    window.location.reload();
    this.viewReports = false;
    this.generateReport = true;
    this.tableView = false;
  }

  // ------gf-----

  regType = [
    { registration: "PF Report", value: "PF" },
    { registration: "GF Report", value: "GF" },
  ];

  ChangeRegistration() {
    if (this.report.value.registration_type == "GF") {
      this.viewreportFormControl();
      this.gfcompany();
    } else {
      this.viewreportFormControl();
      this.getCompanyName();
    }
  }

  viewAllreportFormControl(registration) {
    this.viewreport = this.fb.group({
      registration_type: new FormControl(""),
      report_name: [registration, Validators.required],
      report_type: [""],
      from_date: [""],
      to_date: [""],
    });
    console.log(registration);
  }

  ChangeViewRegistration() {
    console.log("res");
    // if(this.report.value.registration_type== 'PF Report'){
    // this.gfreport= true
    // console.log(this.report.value.report_name,this.report.value.registration_type)

    this.viewreportFormControl();
    // }else{
    // this.gfreport= false
    // this.viewAllreportFormControl()
    // }
  }

  get registerFormControl() {
    return this.report.controls;
  }

  get registerFormControls() {
    return this.viewreport.controls;
  }
  selectedSimpleItem = [];
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.org_name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.org_name.toLocaleLowerCase().indexOf(term) > -1
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
