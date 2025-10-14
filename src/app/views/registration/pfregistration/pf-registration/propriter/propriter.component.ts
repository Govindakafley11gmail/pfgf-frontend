import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../../../_service/pf/pfservice.service';


@Component({
  selector: 'app-propriter',
  templateUrl: './propriter.component.html',
  styleUrls: ['./propriter.component.scss']
})
export class PropriterComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('myModals') public myModals: ModalDirective;
  @Input() companyId!: number;
  
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
  save: boolean=true;
  update;
  id
  noarrow
  arrow
  status
  sid
  constructor(private PFservice: PfserviceService, private fb: FormBuilder, private tosatr: ToastrService,private route:ActivatedRoute) { }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['companyId'] && this.companyId) {
    this.getPropriterByCompanyId(this.companyId);
    this.Proprietors.patchValue({prop_company_id: this.companyId})
  }
}
  ngOnInit() {
    console.log(this.companyId)
    // this.pfRegistrationList()
    this.propriterFormControl();
    if (this.companyId) {
       this.Proprietors = this.fb.group({
      p_id: [''],
      prop_company_id: new FormControl(this.companyId),
      proprietor_name: new FormControl('', [Validators.required]),
      contact_number: new FormControl('',[Validators.required]),
      email_id: new FormControl(''),
      employee_detail:new FormControl(''),
      designation:new FormControl(''),
      address: new FormControl('', [Validators.required]),
      status: new FormControl('Active')
    });
      this.getPropriterByCompanyId(this.companyId);
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
    if (this.companyId) {
      this.save =true;

      this.sid = this.companyId;
      this.update=false;
      this.myModal.show();
      this.status = false;
     this.propriterFormControl()
    } else {
      this.tosatr.warning('Cannot Create Proprietor before creating Organization !');
      // this.myModal.hide();
    }
  }
  closepopup() {
    this.myModal.hide();
    this.status = false;

  }
  propriterFormControl() {
    this.Proprietors = this.fb.group({
      p_id: [''],
      prop_company_id: new FormControl(''),
      proprietor_name: new FormControl('', [Validators.required]),
      contact_number: new FormControl('',[Validators.required]),
      email_id: new FormControl(''),
      employee_detail:new FormControl(''),
      designation:new FormControl(''),
      address: new FormControl('', [Validators.required]),
      status: new FormControl('Active')
    });
  }
  submitted
  createPropriter() {
    console.log( this.Proprietors.value)
    // stop here if form is invalid
    if (this.Proprietors.invalid) {
      this.submitted = true;
        return;
    }
    if (this.Proprietors.valid) {
      this.isLoading = true;
      this.PFservice.createPropriter(this.Proprietors.value).subscribe(res => {
        this.Proprietors.reset()
        this.submitted = false;
        this.isLoading = false;
        this.status = false;
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



  getPropriterByCompanyId(companyId) {
    // this.sid = this.route.snapshot.params['id'];
    this.PFservice.getPropriterByCompanyId(companyId).subscribe(res => {
      this.listPropriter = res;
      this.dtTrigger.next();
      this.ngOnDestroy();

    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  listCompaneyDetails() {
    this.PFservice.PFcompaneyRegistrationList().subscribe(res => {
      this.companeyName = res
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  show(id) {
    this.ids = id;
    this.myModals.show();
  }
  deletePropriterDetailById(id) {
    this.isLoading = true;
    this.PFservice.deletePropriterById(id).subscribe(res => {
      this.isLoading = false;
      // this.getPropriterByCompanyId();
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
    this.PFservice.getPropriterById(idss).subscribe(res => {
      this.save =false;
      this.status = true
      this.isLoading = false;
      this.update=true;
      this.status = true;
      this.Proprietors = this.fb.group({
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
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  updatePropriteById() {
    this.isLoading = true;
    this.PFservice.updatePropriteById(this.Proprietors.value.id, this.Proprietors.value).subscribe(res => {
      this.isLoading = false;
      this.Proprietors.reset();
      this.Proprietors.reset(this.Proprietors);
      this.tosatr.success('Proprite Updated Successfully !');
      // this.getPropriterByCompanyId();
      this.myModal.hide();
      this.status = false;
      this.ngOnDestroy();
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    });
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
   

  }
  get registerFormControl() {
    return this.Proprietors.controls;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}



