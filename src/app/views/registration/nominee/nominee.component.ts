import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfemployeeService} from '../../_service/pfemployee/pfemployee.service';

@Component({
  selector: 'app-nominee',
  templateUrl: './nominee.component.html',
  styleUrls: ['./nominee.component.scss']
})
export class NomineeComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
    @Input() employeeData: any; // This will receive data from parent
  
  dtOptions: any = {};
  pfNominee: FormGroup;
  pfNomineeDetail;
  ids;
  depatment;
  org_Id;
  isCollapsed: boolean;
  save:boolean=true;
  update:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tosatr: ToastrService,
    private pfemployee: PfemployeeService,
  ){

}
ngOnChanges() {
  if (this.employeeData) {

  }
}

  ngOnInit(): void {
    this.pfNomineeFormcontrol();
    if (this.employeeData) {
      this.getPFNomineeDetails(this.employeeData);
    }
    this.isCollapsed = true;
  }

  collapse() {
    this.isCollapsed = false;
  }

  Notcollapse() {
    this.isCollapsed = true;

  }

  gender = [
    {gender: 'Male'},
    {gender: 'Female'}
  ];

  pfNomineeFormcontrol() {
    this.pfNominee = this.fb.group({
      nominee_id: [''],
      nominee_employee_id: [this.employeeData, [Validators.required]],
      name: ['', [Validators.required]],
      relationship: ['', [Validators.required]],
      identification_no: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      contact_no: [''],
      email_id: [''],
      percentage_share: ['', [Validators.required]],
      remarks: [''],
      address: ['', [Validators.required]],
    });
  }

  submitted;
  countNominee;

  async createPfNomineeDetails() {

 
      this.createNominee();
    
  }

  async createNominee() {

    await this.pfemployee.createPfNomineeDetails(this.pfNominee.value).subscribe(res => {
      if (res[0] == 'success') {
        this.tosatr.success(res['message']);
        // this.getPFNomineeDetails(this.route.snapshot.params['id']);
        this.ngOnDestroy();
      } else {
        this.tosatr.error(res['message']);
      }
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  async getPFNomineeDetails(employee_id) {
    await this.pfemployee.getPfNomineeDetails(employee_id).subscribe(res => {
      this.pfNomineeDetail = res;
      this.dtTrigger.next();
      this.ngOnDestroy();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  show(id) {
    this.ids = id;
    // this.myModals.show();
  }

  async deletePfNomineeDetailsById(id) {
    this.pfemployee.deletePfNomineeDetailsById(id).subscribe(res => {
      // this.getPFNomineeDetails();
      this.tosatr.success('Deleted successfully!!!');
      console.log(res);
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  getPfNomineeById(id) {
    this.save = false;
    this.update = true;
    this.pfemployee.getPfNomineeById(id).subscribe(res => {
      console.log(res);
      this.pfNominee = this.fb.group({
        id: [res[0]['id'], [Validators.required]],
        nominee_id: [res[0]['nominee_id'], [Validators.required]],
        nominee_employee_id: [res[0]['nominee_employee_id'], [Validators.required]],
        name: [res[0]['name'], [Validators.required]],
        relationship: [res[0]['relationship'], [Validators.required]],
        identification_no: [res[0]['identification_no'], [Validators.required]],
        date_of_birth: [res[0]['date_of_birth'], [Validators.required]],
        contact_no: [res[0]['contact_no'], [Validators.required]],
        email_id: [res[0]['email_id']],
        percentage_share: [res[0]['percentage_share'], [Validators.required]],
        remarks: [res[0]['remarks']],
        address: [res[0]['address'], [Validators.required]]
      });
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  updataPfNomineeById() {
    console.log(this.pfNominee.value.id, this.pfNominee.value);
    this.pfemployee.updataPfNomineeById(this.pfNominee.value.id, this.pfNominee.value).subscribe(res => {
      this.tosatr.success('Updated successfully!!!');
      // this.getPFNomineeDetails();
      this.pfNominee.reset(this.pfNominee);
      this.myModal.hide();
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  create() {
    if (this.route.snapshot.params['id']) {
      this.save = true;
      this.update = false;
      this.myModal.show();
      this.pfNomineeFormcontrol();
    } else {
      this.tosatr.warning('Failed to create Pf-Employee.');
    }
  }

  get registerFormControl() {
    return this.pfNominee.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}

