import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';
import {CompanyService} from '../../../_service/GF-API/company.service';
import { UserService } from '../../../_service/user.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allgfUsers
  edit
  update
  ids

  constructor(private userservice:UserService,private gfcompanyservice:CompanyService,private tosatr: ToastrService, private fb: FormBuilder, private router: Router) { }

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
    await this.gfcompanyservice.PFcompaneyRegistrationList().subscribe(res => {
      this.isLoading = false;
      if(res['success']){
        this.allgfUsers = res['data'];
      }
      this.dtTrigger.next();
    },error=>{
      this.tosatr.error(error['statusText'] +". "+error.error.message);
      this.isLoading = false
    })
  }

  editform() {
    this.edit = false;
    this.update = true;
  }

  editpfCompaneyRegistrationByIds(id): void {
    this.router.navigate(['/registration/company-registration', id])
  }

  show(id) {
    this.ids = id;
    this.myModals.show();
  }

  async deleteOrganizationListById(id) {
    this.isLoading = true;
    await this.gfcompanyservice.deletePfOrganizationCompaney(id).subscribe(res => {
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
