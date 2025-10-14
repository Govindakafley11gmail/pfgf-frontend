import { Component, OnInit, OnDestroy, ViewChild, Input } from "@angular/core";
import { Subject } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { UserService } from "../../_service/user.service";
import { PfemployeeService } from "../../_service/pfemployee/pfemployee.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from "../../_service/api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PfserviceService } from "../../_service/pf/pfservice.service";
@Component({
  selector: "app-employee-details",
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.scss"],
})
export class EmployeeDetailsComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  @Input() employeeData!: string;

  isLoading = false;
  pfemployeeDetail: any[] = [];
  totalcontribution: number[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  activeTab: number = 1;

  createEmployee = false;
  employeeEdit = false;
  employeeDelete = false;
  listPermission: string[] = [];
  selectedEmployee: any;
  pfEmployee: FormGroup;
  pfaccno: any;
  isDisabled: boolean;
  save: boolean = true;
  edit: boolean = false;
  cancel: boolean = false;
  update: boolean = false;
  dropdownDisable: boolean = false;
  companyacno: boolean = false;
  registrationDate: boolean = false;
  identification_type: any;
  dropdownEnable: boolean;
  constructor(
    private pfemployee: PfemployeeService,
    private userservice: UserService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private pfservice: PfserviceService,
  ) { }

  ngOnInit(): void {
    this.getPFEmployeeDetails();

    this.listPermissionCheck();
    this.pfemployeeFormcontrol();
    this. getPfEmployeeAccNo();
  }
  getcompanyId($event) {
    this.pfservice.editPfCompaneyById($event.company_id).subscribe(
      (res) => {
        this.pfEmployee
          .get("company_account_no")
          .patchValue(res["Data"].company_account_no);
      },
      (error) => {
        this.toastr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  EmployeeContributionAmt1: number = 0;
  EmployeeContributionAmt2: number = 0;
  EmployeeContributionAmt: number = 0;
  EmployerContributionAmt: number = 0;
  EmployeeTotalContributionAmt: number = 0;
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
  handleRegistrationTypeChange() {
   this. getPfEmployeeAccNo();
  }
  getGFEmployeeAccNo() {
    this.pfservice.GFcompaneyRegistrationList().subscribe(
      (res) => {
        if (res["success"]) {
          this.pfaccno = res["data"];
        }
      },
      (error) => {
        this.toastr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
  getPfEmployeeAccNo() {
    this.pfservice.findAllCompany().subscribe(
      (res) => {
        if (res) {
          this.pfaccno = res;
        }
      },
      (error) => {
        this.toastr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
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
            employee_id_no: [
              res[0]["employee_id_no"],
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
          this.toastr.error(error["statusText"] + ". " + error.error.message);
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
      if (this.pfEmployee.value.registration_type == "PF") {
        this.pfemployee
          .createPfEmployeeDetails(this.pfEmployee.value)
          .subscribe(
            (res) => {
              this.isLoading = false;
              if (res) {
                this.toastr.success(res["message"]);
                this.isDisabled = true;
               this.selectedEmployee = res.employee_id;
                this.save = false;
                this.edit = true;
                this.cancel = false;
                this.update = false;
                this.dropdownDisable = true;
                this.isLoading = true;
              } else {
                this.toastr.success(res["message"]);
              }
            },
            (error) => {
              this.isLoading = false;
              this.toastr.error(
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
              if (res) {
                this.employeeData = res.employee_id;
                this.isDisabled = true;
                this.save = false;
                this.edit = true;
                this.cancel = false;
                this.update = false;
                this.dropdownDisable = true;
                this.isLoading = true;
                this.toastr.success(res["message"]);
                // this.router.navigate(['/registration/pfemployeeregistration', res['message']])
              } else {
                this.toastr.error(res["message"]);
              }
            },
            (error) => {
              this.isLoading = false;
              this.toastr.error(
                error["statusText"] + ". " + error.error.message
              );
            }
          );
      }
    } else {
      this.toastr.warning("Invalid Form!!!");
      // this.myModal.hide();
    }
  }

  identificationType() {
    this.isLoading = true;
    this.pfemployee.identificationType().subscribe(
      (res) => {
        this.isLoading = false;
        this.identification_type = res;
      },
      (error) => {
        this.toastr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }

  updataPfEmployeeById() {
    this.isLoading = true;
    if (this.pfEmployee.value.registration_type == "PF") {
      this.pfemployee
        .updataPfEmployeeById(this.pfEmployee.value.id, this.pfEmployee.value)
        .subscribe(
          (res) => {
            this.isLoading = false;
            if (res[0] == "success") {
              this.toastr.success(res["message"]);
            } else {
              this.toastr.error(res["message"]);
            }
          },
          (error) => {
            this.isLoading = false;
            this.toastr.error(error["statusText"] + ". " + error.error.message);
          }
        );
    } else {
      this.pfemployee.updataGfEmployeeById(this.pfEmployee.value.id, this.pfEmployee.value).subscribe(res => {
        this.isLoading = false;
        if (res[0] == "success") {
          this.toastr.success(res["message"]);
        } else {
          this.toastr.error(res["message"]);
        }
      })
    }
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
      this.toastr.warning("Cannot Update Employee. Due to Status is closed");
      this.isDisabled = true;
      this.save = false;
      this.edit = true;
      this.cancel = false;
      this.update = false;
      this.dropdownDisable = true;
      this.dropdownEnable = false;
    }
  }
  findEmployee(data) {
    this.activeTab = 1;

    this.selectedEmployee = data.pf_employee_id; // Pass it to child
    this.save = false;
    this.edit = true;
    this.isDisabled = true;
    this.dropdownDisable = true;
    this.pfEmployee.patchValue(data);
    this.myModals.show()
  }
  selectedTab(index: number) {
    this.activeTab = index;
  }
  statuss = [{ status: "Active" }, { status: "Closed" }, { status: "Pending" }];
  marital_status = [{ maritalstatus: "Single" }, { maritalstatus: "Married" }];
  nationalitys = [
    { nationality: "Bhutanese" },
    { nationality: "Non-Bhutanese" },
  ];
  gender = [{ gender: "Male" }, { gender: "Female" }];
  identification_types = [
    { id_types_name: "CID" },
    { id_types_name: "Passport" },
    { id_types_name: "Other" },
  ];
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
      employee_id_no: [''],
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
  registrationType = [
    { registration_type: "Provident Fund", value: "PF" },
    { registration_type: "Gratituty Fund", value: "GF" },
  ];
  /**
   * Retrieves all employee details by making a direct API call to the employee endpoint.
   * Sets the loading state to true before the request, includes authentication headers with a Bearer token,
   * updates employee details with the response data, triggers DataTable updates, and handles errors by resetting the loading state.
   */
  getPFEmployeeDetails(): void {
    this.isLoading = true;
    if (localStorage.getItem('access_token')) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      });
      this.http
        .get(`${Api}/findallemployee`, { headers })
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            this.pfemployeeDetail = res.data; // Adjust based on your API response structure
            this.dtTrigger.next();
          },
          error: () => {
            this.isLoading = false;
          }
        });
    }
  }

  listPermissionCheck(): void {
    const userId = parseInt(localStorage.getItem("id")!, 10);
    this.userservice
      .editAllUserWithoutAuth(userId)
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          const permissions = res["user-permissions-list"] || [];
          this.listPermission = permissions.map((p: any) => p.name);

          this.createEmployee = this.listPermission.includes("employee-create");
          this.employeeEdit = this.listPermission.includes("employee-edit");
          this.employeeDelete = this.listPermission.includes("employee-delete");
        },
        error: (err) => {
        },
      });
  }

  // employee 

}
