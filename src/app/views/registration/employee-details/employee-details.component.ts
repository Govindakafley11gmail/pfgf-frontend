import { Component, OnInit, OnDestroy, ViewChild, Input } from "@angular/core";
import { Subject } from "rxjs";

import { ToastrService } from "ngx-toastr";
import { UserService } from "../../_service/user.service";
import { PfemployeeService } from "../../_service/pfemployee/pfemployee.service";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: "app-employee-details",
  templateUrl: "./employee-details.component.html",
  styleUrls: ["./employee-details.component.scss"],
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
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

  private unsubscribe$ = new Subject<void>();

  constructor(
    private pfemployee: PfemployeeService,
    private userservice: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.listPermissionCheck();
    this.getPFEmployeeDetails();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  findEmployee(data) {
    console.log('employee',data)
    this.activeTab = 1;
    
    this.selectedEmployee = data; // Pass it to child
    this.myModals.show()
  }
  selectedTab(index: number) {
    console.log(this.activeTab);
    this.activeTab = index;
  }
  getPFEmployeeDetails(): void {
    this.isLoading = true;
    this.pfemployee
      .findallemployee()
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        // next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.pfemployeeDetail = res["data"];
        this.dtTrigger.next();

        // this.totalcontribution = this.pfemployeeDetail.map(
        //   (emp) =>
        //     parseInt(emp.employee_contribution_amount, 10) +
        //     parseInt(emp.employer_contribution_amount, 10)
        // );

        this.dtTrigger.next();
      },error=>{
          this.isLoading = false;
      });
  }

  listPermissionCheck(): void {
    const userId = parseInt(localStorage.getItem("id")!, 10);
    this.userservice
      .editAllUserWithoutAuth(userId)
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          const permissions = res["user-permissions-list"] || [];
          this.listPermission = permissions.map((p: any) => p.name);

          this.createEmployee = this.listPermission.includes("employee-create");
          this.employeeEdit = this.listPermission.includes("employee-edit");
          this.employeeDelete = this.listPermission.includes("employee-delete");
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
