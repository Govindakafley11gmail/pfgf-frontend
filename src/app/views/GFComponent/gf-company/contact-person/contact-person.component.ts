import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {CompanyService} from '../../../_service/GF-API/company.service';
import {UserService} from '../../../_service/user.service';

@Component({
  selector: 'contact-person',
  templateUrl: './contact-person.component.html',
  styleUrls: ['./contact-person.component.scss']
})
export class ContactPersonComponent implements OnInit, OnDestroy {

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {};
  save
  update
  ContactPerson: FormGroup;
  contactPersonDetail;
  ids;
  depatment;
  isCollapsed: boolean = true;
  org_Id;
  sid;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private gfcompanyservice: CompanyService, private tosatr: ToastrService, private uservices: UserService) { }


  ngOnInit(): void {
    this.contactPersonFormcontrol()
    if(this.route.snapshot.params['id']) {
      this.getContactPersonByCompanyId()
    }
   
  }

  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  start() {
    this.isLoading = true;
    this.wait(2000).then(() => this.isLoading = false);
  }
  contactPersonFormcontrol() {
    this.ContactPerson = this.fb.group({
      contact_id: [''],
      contact_person_company_id: [this.route.snapshot.params['id']],
      contact_person_name: ['', [Validators.required]],
      contact_no: ['', [Validators.required]],
      fix_line_no: [''],
      ext_no: [''],
      email_id: [''],
      designation: [''],
      department: [''],
      address: ['', [Validators.required]]
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    if (this.route.snapshot.params['id']) {
      this.getContactPersonByCompanyId();
    } else {
      this.tosatr.warning('Failed to List Introducer before Creating Organization !')
    }
    // console.log(event);
  }

  submitted
  createContactPersonDetail() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.ContactPerson.invalid) {
      return;
    }
    console.log(this.ContactPerson.value)
    if (this.ContactPerson.valid) {
      this.isLoading = true;
      this.gfcompanyservice.createContactPersionDEtails(this.ContactPerson.value).subscribe(res => {
        this.isLoading = false;
        this.getContactPersonByCompanyId();
        this.tosatr.success('Created successfully!!!')
        this.clearForm()
        this.myModal.hide();
        this.ngOnDestroy();
      }, error => {
        this.isLoading = false;
          this.tosatr.error(error['statusText'] +". "+error.error.message);
        this.myModal.hide()
      })
    } else {
      this.tosatr.warning('Invalid Form!!!')
      this.myModal.hide();
    }
  }
  clearForm() {

    this.ContactPerson.reset({

      'contact_person_company_id': '',
      'contact_person_name': '',
      'contact_no': '',
      'fix_line_no': '',
      'ext_no': '',
      'email_id': '',
      'designation': '',
      'department': '',
      'address': ''
    });
  }
  getContactPersonByCompanyId() {
    this.sid = this.route.snapshot.params['id'];
    this.gfcompanyservice.getContactPersionCompanyId(this.sid).subscribe(res => {
      this.contactPersonDetail = res
      console.log(res)
      this.dtTrigger.next();
      this.ngOnDestroy();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  show(id) {
    this.ids = id
    this.myModals.show();
  }

  deleteContactPersonDetailById(id) {
    this.isLoading = true;
    this.gfcompanyservice.deleteContactPersionDEtailsById(id).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Deleted successfully!!!')
      this.getContactPersonByCompanyId();
      this.myModals.hide();
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getContactPersonById(id) {
    this.isLoading = true;
    this.gfcompanyservice.getContactPersonById(id).subscribe(res => {
      this.isLoading = false;
      this.myModal.show()
      this.save = false;
      this.update = true;
      this.ContactPerson = this.fb.group({
        id: [res[0]['id']],
        contact_id: [res[0]['contact_id']],
        contact_person_company_id: [res[0]['contact_person_company_id']],
        contact_person_name: [res[0]['contact_person_name']],
        contact_no: [res[0]['contact_no']],
        fix_line_no: [res[0]['fix_line_no']],
        ext_no: [res[0]['ext_no']],
        email_id: [res[0]['email_id']],
        designation: [res[0]['designation']],
        department: [res[0]['department']],
        address: [res[0]['address']]
      })
    }, error => {
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  updateContactPersonById() {
    this.isLoading = true;
    this.gfcompanyservice.updateContactPeronById(this.ContactPerson.value.id, this.ContactPerson.value).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Updated successfully!!!');
      this.myModal.hide();
      this.getContactPersonByCompanyId();
      this.clearForm()
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  closepopup() {
    this.clearForm();
    this.myModal.hide()
  }

  create() {
    if (this.route.snapshot.params['id']) {
      // this.getDepartment()
      this.save = true;
      this.update = false;
      this.myModal.show();
      this.contactPersonFormcontrol()
    } else {
      this.tosatr.warning('Failed to Create GF-Orginization and MOU!!!');
      this.myModal.hide();
    }

    // this.createRole.reset();
  }
  get registerFormControl() {
    return this.ContactPerson.controls;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
