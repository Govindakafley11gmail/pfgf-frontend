import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "../_service/user.service";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  employeeSearch: FormGroup;
  employeeDetails: any;
  isLoading: boolean = false;
  constructor(private users: UserService, private tosatr: ToastrService) {}
 dtTrigger: Subject<any> = new Subject<any>();
 dtOptions: any = {};

  ngOnInit(): void {
    this.employeeSearch = new FormGroup({
      employee_name: new FormControl(""),
      employee_id_no: new FormControl(""),
      identification_no: new FormControl(""),
      email_id: new FormControl(""),
      contact_no: new FormControl(""),
    });
  }
  
  async searchEmployee() {
        this.isLoading = true;

    const searchData = this.employeeSearch.value;
    await this.users.searchuser(searchData).subscribe(
      (res) => {
        this.isLoading = false;
        if (res["success"]) {
          this.employeeDetails = res["data"];
        }
      },
      (error) => {
        this.tosatr.error(error["statusText"] + ". " + error.error.message);
        this.isLoading = false;
      }
    );
  }
}
