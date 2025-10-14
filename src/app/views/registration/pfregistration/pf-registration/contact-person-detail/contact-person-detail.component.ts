import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../../../_service/pf/pfservice.service';
import {UserService} from '../../../../_service/user.service';

@Component({
  selector: 'app-contact-person-detail',
  templateUrl: './contact-person-detail.component.html',
  styleUrls: ['./contact-person-detail.component.scss']
})
export class ContactPersonDetailComponent implements OnInit, OnDestroy {
    @Input() companyId!: number;
  
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  save:boolean=true;
  update
  ContactPerson: FormGroup;
  contactPersonDetail;
  ids;
  depatment;
  isCollapsed: boolean = true;
  org_Id;
  sid;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private pfservice: PfserviceService, private tosatr: ToastrService, private uservices: UserService) { }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['companyId'] && this.companyId) {
    this.contactPersonFormcontrol();
    this.ContactPerson.patchValue({prop_company_id: this.companyId})
  }
}
  ngOnInit(): void {
    this.contactPersonFormcontrol();
    if(this.companyId){
      this.getContactPersonByCompanyId(this.companyId);
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
      contact_person_company_id: [''],
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
      // this.getContactPersonByCompanyId();
   
    // console.log(event);
  }

  submitted
  createContactPersonDetail() {


    // stop here if form is invalid
    if (this.ContactPerson.invalid) {
      this.submitted = true;
        return;
    }
    if (this.ContactPerson.valid) {
      this.isLoading = true;
      this.pfservice.createContactPersionDEtails(this.ContactPerson.value).subscribe(res => {
        this.isLoading = false;
        this.submitted = false;
        // this.getContactPersonByCompanyId();
        this.tosatr.success('Created successfully!!!')
        // this.myModal.hide();
        this.ngOnDestroy();
      }, error => {
        this.isLoading = false;
        this.tosatr.error(error['statusText'] +". "+error.error.message);
        // this.myModal.hide()
      })
    } else {
      this.tosatr.warning('Invalid Form!!!')
      this.myModal.hide();
    }
  }
 
  getContactPersonByCompanyId(companyId) {
    
    this.pfservice.getContactPersionCompanyId(companyId).subscribe(res => {
      this.contactPersonDetail = res
      console.log(res)
      this.dtTrigger.next();
      this.ngOnDestroy();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  show(id) {
    this.ids = id
    // this.myModals.show();
  }

  deleteContactPersonDetailById(id) {
    this.isLoading = true;
    this.pfservice.deleteContactPersionDEtailsById(id).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Deleted successfully!!!')
      // this.getContactPersonB/yCompanyId();
      // this.myModals.hide();
      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  getContactPersonById(id) {
    this.isLoading = true;
    this.pfservice.getContactPersonById(id).subscribe(res => {
      this.isLoading = false;
      // this.myModal.show()
      this.save = false;
      this.update = true;
      this.ContactPerson = this.fb.group({
        id:[res[0]['id']],
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
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  updateContactPersonById() {
    this.isLoading = true;
    this.pfservice.updateContactPeronById(this.ContactPerson.value.id, this.ContactPerson.value).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Updated successfully!!!');
      // this.myModal.hide();
      // this.getContactPersonByCompanyId();

      this.ngOnDestroy();
    }, error => {
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  closepopup() {

    this.myModal.hide()
  }

  create() {
    if (this.route.snapshot.params['id']) {
      // this.getDepartment()
      this.save = true;
      this.update = false;
      this.myModal.show();

    } else {
      this.tosatr.warning('Failed to Create PF-Orginization and MOU!!!');
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
