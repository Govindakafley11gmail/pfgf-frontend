import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { PfemployeeService } from '../../_service/pfemployee/pfemployee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employeeloan',
  templateUrl: './employeeloan.component.html',
  styleUrls: ['./employeeloan.component.scss']
})
export class EmployeeloanComponent implements OnInit {
 loanForm!: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  @Input() employeeData: any; // This will receive data from parent
  loanDetails: any;
  submitted = false;
  constructor(private fb: FormBuilder, private loanService: PfemployeeService,     private toastr: ToastrService,
  ) {}
  ngOnChanges(){
    if (this.employeeData) {
      this.fetchEmployeeLoanDetails();
    }
  }

  ngOnInit(): void {
    console.log('Employee Data:', this.employeeData);
    this.loanForm = this.fb.group({
      bank_name: ['', Validators.required],
      loan_account_no: ['', Validators.required],
      loan_employee_id: [this.employeeData, Validators.required],
      loan_id: [''],
      loan_status: ['', Validators.required], // could use dropdown with enum values
      sanction_amount: ['', [Validators.required, Validators.min(1)]],
      sanction_date: ['', Validators.required]
    });
    this.fetchEmployeeLoanDetails();
  }
  fetchEmployeeLoanDetails(){
    this.loanService.fetchEmployeeLoan(this.employeeData).subscribe((res)=>{
      this.loanDetails = res;
      this.dtTrigger.next();
    })
  }

 onSubmit(): void {

  if (this.loanForm.valid) {
    console.log('Loan Data:', this.loanForm.value);

    this.loanService.addLoan(this.loanForm.value).subscribe(res=>
    {
            this.toastr.success('Loan added successfully!!!');

        // Optional: Reset form after success
        this.loanForm.reset();  
        // Optional: Show success toast / message
      },
      (error) => {
        console.error('Error adding loan:', error);
        // Optional: Show error toast / message
      }
    );

  } else {
    // Mark all fields as touched to show validation errors
    this.loanForm.markAllAsTouched();
  }
}
isSaved: boolean = true;
isUpdate: boolean = false;
editLoan(data) {
  this.isSaved= false;
  this.isUpdate = true;
  this.loanForm.patchValue({
    loan_id: data.loan_id,
    bank_name: data.bank_name,
    loan_account_no: data.loan_account_no,
    loan_status: data.loan_status,
    sanction_amount: data.sanction_amount,
    sanction_date: data.sanction_date
  });

}

updateLoan() {
  if (this.loanForm.valid) {
    this.loanService.updateLoan(this.loanForm.value).subscribe(
      (res) => {
        this.toastr.success('Loan updated successfully!!!');
        this.fetchEmployeeLoanDetails();
        this.loanForm.reset();
      },
      (error) => {
        console.error('Error updating loan:', error);
      }
    );
  } else {
    this.loanForm.markAllAsTouched();
  }
}

}