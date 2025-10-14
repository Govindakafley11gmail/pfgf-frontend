import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {PfserviceService} from '../../../_service/pf/pfservice.service';
import { UserService } from '../../../_service/user.service';

@Component({
  selector: 'app-pf-registration-list',
  templateUrl: './pf-registration-list.component.html',
  styleUrls: ['./pf-registration-list.component.scss']
})
export class PfRegistrationListComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allPFUsers
  ids;
  edit;
  update;
  organizationRegistration: FormGroup
  id;
  constructor(private userservice:UserService,private PFservice: PfserviceService, private tosatr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.pfRegistrationList()
    this.listpermission();
  }
  createcompany;
  companyEdit;
  companyDelete
  listPermission = []
  listpermission(){
    this.userservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
      console.log(res)
        for(let j=0;j<res['user-permissions-list'].length;j++){
        this.listPermission[j] =  res['user-permissions-list'][j].name
        if(this.listPermission[j] == 'company-create'){
          console.log(this.listPermission[j])
          this.createcompany = true;
          
        }else if(this.listPermission[j] == 'company-edit'){
          this.companyEdit = true;
        }else if(this.listPermission[j] == 'company-delete') {
          this.companyDelete = true;
        }
      }
    })
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

  async pfRegistrationList() {
    this.isLoading = true;
    await this.PFservice.PFcompaneyRegistrationList().subscribe(res => {
      this.isLoading = false;
      if(res['success']){
        this.allPFUsers = res['data'];
      }
      this.dtTrigger.next();
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }

  editform() {
    this.edit = false;
    this.update = true;
  }

  editpfCompaneyRegistrationByIds(id): void {
    this.router.navigate(['/registration/PFCompaneyRegistration', id])
  }

  show(id) {
    this.ids = id;
    this.myModals.show();
  }

  async deleteOrganizationListById(id) {
    this.isLoading = true;
    await this.PFservice.deletePfOrganizationCompaney(id).subscribe(res => {
      this.isLoading = false;
      this.pfRegistrationList();
      this.tosatr.success('Deleted successfully!!!');
      this.myModals.hide();
    }, error => {
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
}

