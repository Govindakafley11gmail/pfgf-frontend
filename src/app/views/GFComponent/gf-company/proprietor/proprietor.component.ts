import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {CompanyService} from '../../../_service/GF-API/company.service';

@Component({
  selector: 'proprietor',
  templateUrl: './proprietor.component.html',
  styleUrls: ['./proprietor.component.scss']
})
export class ProprietorComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  allPFUsers
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  Proprietors: FormGroup
  ids;
  listPropriter;
  companeyName;
  getElemnet;
  number;
  prop_company_ids;
  isCollapsed: boolean = true;
  orgId;
  org_Id;
  save;
  update;
  id
  noarrow
  arrow
  sid
  status
  constructor(private gfcompanyservice: CompanyService, private fb: FormBuilder, private tosatr: ToastrService,private route:ActivatedRoute) { }

  ngOnInit() {
    // this.pfRegistrationList()
    this.propriterFormControl();
    if(this.route.snapshot.params['id']) {

      this.getPropriterByCompanyId();
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

  create() {
    this.clearForm();
    if (this.route.snapshot.params['id']) {
      this.save =true;

      this.sid = this.route.snapshot.params['id'];
      this.update=false;
      this.myModal.show();
     this. propriterFormControl()
    } else {
      this.tosatr.warning('Cannot Create Proprietor before creating Organization !');
      // this.myModal.hide();
    }
  }
  closepopup() {
    this.clearForm();
    this.myModal.hide();

  }
  propriterFormControl() {
    this.status = false;
    this.Proprietors = this.fb.group({
      p_id: [''],
      prop_company_id: [parseInt(this.sid)],
      proprietor_name: ['', [Validators.required]],
      contact_number: ['', [Validators.required]],
      email_id: [''],
      employee_detail:[''],
      designation:[''],
      address: ['', [Validators.required]],
      status: ['Active']
    })
  }

  submitted
  createPropriter() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.Proprietors.invalid) {
        return;
    }
    if (this.Proprietors.valid) {
      this.isLoading = true;
      this.gfcompanyservice.createPropriter(this.Proprietors.value).subscribe(res => {
        this.getPropriterByCompanyId()
        this.isLoading = false;
        this.clearForm() ;
        this.status = false;
        this.myModal.hide()
        this.tosatr.success('Created successfully!!!')
        this.ngOnDestroy();
      }, error => {
        this.isLoading = false;
        this.tosatr.error(error['statusText'] +". "+error.error.message);
      })
    } else {
      this.tosatr.warning('Form is Invalid!!!')
    }
  }

  clearForm() {

    this.Proprietors.reset({

      'proprietor_name': '',
      'contact_number': '',
      'email_id': '',
      'ext_no': '',
      'employee_detail':'',
      'designation':'',
      'address':'',
      'status': ''
    });
  }

  getPropriterByCompanyId() {
    this.sid = this.route.snapshot.params['id'];
    this.gfcompanyservice.getPropriterByCompanyId(this.sid).subscribe(res => {
      this.listPropriter = res;
       console.log(res)
      this.dtTrigger.next();
      this.ngOnDestroy();

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }
  listCompaneyDetails() {
    this.gfcompanyservice.PFcompaneyRegistrationList().subscribe(res => {
      this.companeyName = res
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  show(id) {
    this.ids = id;
    this.myModals.show();
  }
  deletePropriterDetailById(id) {
    this.isLoading = true;
    this.gfcompanyservice.deletePropriterById(id).subscribe(res => {
      this.isLoading = false;
      this.getPropriterByCompanyId();
      this.myModals.hide()
      this.tosatr.success('Deleted successfully!!!')
      this.ngOnDestroy();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  getPropriterDetailsById(idss) {
    this.isLoading = true;
    this.gfcompanyservice.getPropriterById(idss).subscribe(res => {
      this.save =false;
      this.status = true;
      this.isLoading = false;
      this.update=true;
      this.myModal.show()
      this.Proprietors = this.fb.group({
        id:[res[0]['id']],
        p_id: [res[0]['p_id']],
        prop_company_id: [res[0]['prop_company_id']],
        proprietor_name: [res[0]['proprietor_name']],
        contact_number: [res[0]['contact_number']],
        email_id: [res[0]['email_id']],
        employee_detail:[res[0]['employee_detail']],
        address: [res[0]['address']],
        status: [res[0]['status']],
        designation:[res[0]['designation']],
      })
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  updatePropriteById() {
    this.isLoading = true;
    this.gfcompanyservice.updatePropriteById(this.Proprietors.value.id, this.Proprietors.value).subscribe(res => {
      this.isLoading = false;
      this.tosatr.success('Proprietor Updated Successfully !')
      this.getPropriterByCompanyId();
      this.myModal.hide();
      this.status = false;
      this.clearForm();
      this.ngOnDestroy();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false;
    })
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
    if(this.route.snapshot.params['id']){
      this.getPropriterByCompanyId()
    }else{
      this.tosatr.warning('Failed to List Proprieter By Company !')
    }

  }
  get registerFormControl() {
    return this.Proprietors.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
