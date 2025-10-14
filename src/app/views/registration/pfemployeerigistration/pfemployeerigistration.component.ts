import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { PfserviceService } from "../../_service/pf/pfservice.service";
import { PfemployeeService } from "../../_service/pfemployee/pfemployee.service";

@Component({
  selector: "app-pfemployeerigistration",
  templateUrl: "./pfemployeerigistration.component.html",
  styleUrls: ["./pfemployeerigistration.component.scss"],
})
export class PfemployeerigistrationComponent implements OnInit {
  @ViewChild("myModal") public myModal: ModalDirective;
  @ViewChild("myModals") public myModals: ModalDirective;
  @Input() employeeData: any; // This will receive data from parent

  // Create an EventEmitter

  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  pfEmployee: FormGroup;
  ids;
  depatment;
  org_Id;
  contributions: any;
  totalcontribution;
  totalcontribution2;
  basic_pay: any;
  cont_rate: any;
  EmployeeContributionAmt;
  EmployeeContributionAmt1;
  EmployeeContributionAmt2;
  EmployeeTotalContributionAmt;
  identification_type;
  pfaccno;
  sid;
  isDisabled;
  save;
  edit;
  cancel;
  update;
  dropdownDisable;
  dropdownEnable;
  number;
  pfaccCompanyId;
  companyid;
  getitByCompanyId = "";
  EmployerContributionAmt;
  registrationDate;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tosatr: ToastrService,
    private pfemployee: PfemployeeService,
    private pfservice: PfserviceService,
  ) {
    // this.getPfEmoloyeeAccNo();
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes["employeeData"] && this.employeeData) {
  //     this.fetchCompanyDetails();
  //     this.isDisabled = true;
  //     this.save = false;
  //     this.edit = true;
  //     this.cancel = false;
  //     this.update = false;
  //     this.dropdownDisable = true;
  //     this.pfEmployee.patchValue(this.employeeData);
  //   }
  // }
  companyacno = true;
  ngOnInit(): void {
    this.pfemployeeFormcontrol();
    this.identificationType();
    this.fetchCompanyDetails();
    console.log(this.employeeData);
    if (!this.employeeData) {
     this.pfEmployee.patchValue(this.employeeData);

      this.save = true;
      this.edit = false;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
    } else {
      this.isDisabled = true;
      this.save = false;
      this.edit = true;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = true;
      this.isLoading = true;
    }
  }
  async fetchCompanyDetails() {
    this.isLoading = true;
    await this.pfservice.findAllCompany().subscribe(res => {
      this.isLoading = false;
      // if(res['success']){
      this.pfaccno = res;
      // }
      this.dtTrigger.next();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] + ". " + error.error.message);
    })
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
  gender = [{ gender: "Male" }, { gender: "Female" }];
  calculation1() {
    this.EmployeeContributionAmt1 = this.pfEmployee.value.basic_pay;
    this.EmployeeContributionAmt2 = this.pfEmployee.value.contribution;
    this.EmployeeContributionAmt =
      (this.EmployeeContributionAmt1 * this.EmployeeContributionAmt2) / 100;
    this.EmployerContributionAmt =
      (this.EmployeeContributionAmt1 * this.EmployeeContributionAmt2) / 100;
    this.EmployeeTotalContributionAmt = this.EmployeeContributionAmt;
    let rows = this.pfEmployee.get("total_contribution");
    rows.patchValue(this.EmployeeTotalContributionAmt);
  }
  statuss = [{ status: "Active" }, { status: "Closed" }, { status: "Pending" }];

  pfemployeeFormcontrol() {
    this.pfEmployee = this.fb.group({
      id: [""],
      registration_type: ["", Validators.required],
      pf_employee_id: [""],
      company_id: ["", [Validators.required]],
      company_account_no: ["", [Validators.required]],
      employee_name: ["", [Validators.required]],
      date_of_birth: [""],
      gender: [""],
      marital_status: [""],
      nationality: ["", [Validators.required]],
      identification_types: ["", [Validators.required]],
      identification_no: ["", [Validators.required]],
      designation: [""],
      department: [""],
      service_joining_date: ["", [Validators.required]],
      contact_no: [""],
      email_id: [""],
      address: ["", [Validators.required]],
      basic_pay: ["", [Validators.required]],
      contribution: ["", [Validators.required]],
      employee_contribution_amount: [""],
      employer_contribution_amount: [""],
      status: ["Active"],
      registration_date: [""],
      total_contribution: [""],
    });
  }
  getcompanyId($event) {
    this.companyacno = true;
    this.pfservice.editPfCompaneyById($event.company_id).subscribe(
      (res) => {
        console.log(res);
        this.pfEmployee
          .get("company_account_no")
          .patchValue(res["Data"].company_account_no);
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  registrationType = [
    { registration_type: "Provident Fund", value: "PF" },
    { registration_type: "Gratituty Fund", value: "GF" },
  ];
  marital_status = [{ maritalstatus: "Single" }, { maritalstatus: "Married" }];
  nationalitys = [
    { nationality: "Bhutanese" },
    { nationality: "Non-Bhutanese" },
  ];
  handleRegistrationTypeChange() {
    if (this.pfEmployee.value.registration_type == "Provident Fund") {
      this.getPfEmployeeAccNo();
    } else {
      this.getGFEmployeeAccNo();
    }
  }
  getGFEmployeeAccNo() {
    this.pfservice.GFcompaneyRegistrationList().subscribe(
      (res) => {
        if (res["success"]) {
          this.pfaccno = res["data"];
        }
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  getPfEmployeeAccNo() {
    this.pfservice.PFcompaneyRegistrationList().subscribe(
      (res) => {
        if (res["success"]) {
          this.pfaccno = res["data"];
        }
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  editPfEmployeeById() {
    if (this.pfEmployee.value.status != "Closed") {
      this.isDisabled = false;
      this.save = false;
      this.edit = false;
      this.cancel = true;
      this.update = true;
      this.dropdownDisable = false;
      this.dropdownEnable = true;
    } else {
      this.tosatr.warning("Cannot Update Employee. Due to Status is closed");
      this.isDisabled = true;
      this.save = false;
      this.edit = true;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
    }
  }

  cancelPfEmployeeById() {
    this.isDisabled = true;
    this.save = false;
    this.edit = true;
    this.cancel = false;
    this.update = false;
    this.dropdownDisable = true;
    this.dropdownEnable = false;
  }
  getPfEmployeeById() {
    this.isDisabled = true;
    this.save = false;
    this.edit = true;
    this.cancel = false;
    this.update = false;
    this.dropdownDisable = true;
    this.isLoading = true;
    this.pfemployee
      .getPfEmployeeById(this.employeeData)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.companyacno = true;
          this.registrationDate = true;
          console.log(res);
          this.pfEmployee = this.fb.group({
            id: [res[0]["id"]],
            pf_employee_id: [res[0]["pf_employee_id"]],
            company_pf_acc_no: [
              res[0]["company_pf_acc_no"],
              [Validators.required],
            ],
            pf_employee_company_id: [
              res[0]["pf_employee_company_id"],
              [Validators.required],
            ],
            employee_name: [res[0]["employee_name"], [Validators.required]],
            date_of_birth: [res[0]["date_of_birth"]],
            gender: [res[0]["gender"]],
            marital_status: [res[0]["marital_status"]],
            nationality: [res[0]["nationality"], [Validators.required]],
            identification_types: [
              res[0]["identification_types"],
              [Validators.required],
            ],
            identification_no: [
              res[0]["identification_no"],
              [Validators.required],
            ],
            designation: [res[0]["designation"]],
            department: [res[0]["department"]],
            service_joining_date: [
              res[0]["service_joining_date"],
              [Validators.required],
            ],
            contact_no: [res[0]["contact_no"]],
            email_id: [res[0]["email_id"]],
            address: [res[0]["address"], [Validators.required]],
            basic_pay: [res[0]["basic_pay"], [Validators.required]],
            contribution: [res[0]["contribution"], [Validators.required]],
            employee_contribution_amount: [
              res[0]["employee_contribution_amount"],
              [Validators.required],
            ],
            employer_contribution_amount: [
              res[0]["employer_contribution_amount"],
              [Validators.required],
            ],
            status: [res[0]["status"], [Validators.required]],
            registration_date: [
              res[0]["registration_date"],
              [Validators.required],
            ],
            total_contribution: [
              res[0]["total_contribution"],
              [Validators.required],
            ],
          });
        },
        (error) => {
          this.tosatr.error(error["statusText"] + ". " + error.error.message);
          this.isLoading = false;
        }
      );
  }
  submitted;
  createPfEmployeeDetails() {
    console.log(this.pfEmployee.value);
    this.submitted = true;
    // {"success":true,"message":"Employee created successfully","employee_id":"20250822762037"}
    if (this.pfEmployee.valid) {
      this.isLoading = true;
      if (this.pfEmployee.value.registration_type == "Provident Fund") {
        this.pfemployee
          .createPfEmployeeDetails(this.pfEmployee.value)
          .subscribe(
            (res) => {
              this.isLoading = false;
              if (res == "success") {
                this.tosatr.success(res["message"]);
                this.isDisabled = true;
                this.employeeData = res;
                this.save = false;
                this.edit = true;
                this.cancel = false;
                this.update = false;
                this.dropdownDisable = true;
                this.isLoading = true;
              } else {
                this.tosatr.success(res["message"]);
              }
            },
            (error) => {
              this.isLoading = false;
              this.tosatr.error(
                error["statusText"] + ". " + error.error.message
              );
            }
          );
      } else {
        this.pfemployee
          .createGFEmployeeDetails(this.pfEmployee.value)
          .subscribe(
            (res) => {
              // this.pfEmployee.reset(this.pfEmployee);
              this.isLoading = false;
              if (res[0] == "success") {
                this.isDisabled = true;
                this.save = false;
                this.edit = true;
                this.cancel = false;
                this.update = false;
                this.dropdownDisable = true;
                this.isLoading = true;
                this.tosatr.success(res["message"]);
                // this.router.navigate(['/registration/pfemployeeregistration', res['message']])
              } else {
                this.tosatr.error(res["message"]);
              }
            },
            (error) => {
              this.isLoading = false;
              this.tosatr.error(
                error["statusText"] + ". " + error.error.message
              );
            }
          );
      }
    } else {
      this.tosatr.warning("Invalid Form!!!");
      // this.myModal.hide();
    }
  }

  identificationType() {
    this.isLoading = true;
    this.pfemployee.identificationType().subscribe(
      (res) => {
        this.isLoading = false;
        this.identification_type = res;
        console.log(res);
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }

  updataPfEmployeeById() {
    this.isLoading = true;
    if (this.pfEmployee.value.registration_type == "Provident Fund") {
      this.pfemployee
        .updataPfEmployeeById(this.pfEmployee.value.id, this.pfEmployee.value)
        .subscribe(
          (res) => {
            this.isLoading = false;
            if (res[0] == "success") {
              this.tosatr.success(res["message"]);
            } else {
              this.tosatr.error(res["message"]);
            }
            this.ngOnDestroy();
          },
          (error) => {
            this.isLoading = false;
            this.tosatr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    }else{
      this.pfemployee.updataGfEmployeeById(this.pfEmployee.value.id, this.pfEmployee.value).subscribe(res=>{
        this.isLoading = false;
        if (res[0] == "success") {
          this.tosatr.success(res["message"]);
        } else {
          this.tosatr.error(res["message"]);
        }
        this.ngOnDestroy();
      })
    }
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }
  create() {
    this.myModal.show();
  }
  get registerFormControl() {
    return this.pfEmployee.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
