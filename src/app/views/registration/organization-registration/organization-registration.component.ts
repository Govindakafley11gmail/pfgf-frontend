import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { UserService } from '../../_service/user.service';
import { PfserviceService } from '../../_service/pf/pfservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organization-registration',
  templateUrl: './organization-registration.component.html',
  styleUrls: ['./organization-registration.component.scss']
})
export class OrganizationRegistrationComponent implements OnInit {
  @ViewChild('myModals') public myModals: ModalDirective;
   @Input() companyId!: string; 

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private userservice: UserService, private PFservice:PfserviceService, private tosatr: ToastrService) { }
   listPermission = []
   createcompany: boolean=false;
   companyEdit: boolean=false;
   companyDelete: boolean=false;
   isLoading: boolean=false;
    activeTab : number= 1;
selectedCompanyId: number
   findAllCompany: any[] = [];

  ngOnInit(): void {
    this.fetchCompanyDetails();
    this.listpermission();
  }
  listpermission(){
    this.userservice.editAllUserWithoutAuth(parseInt(localStorage.getItem('id'))).subscribe(res=>{
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
  closeModal() {
     this.fetchCompanyDetails()
    this.myModals.hide();
  }
  editpfCompaneyRegistrationByIds(company_id){
      this.selectedCompanyId = company_id;
        this.openCreateCompanyModal();


  }
  async fetchCompanyDetails() {
    this.isLoading = true;
    await this.PFservice.findAllCompany().subscribe(res => {
      this.isLoading = false;
      // if(res['success']){
        this.findAllCompany = res;
      // }
      this.dtTrigger.next();
    },error=>{
      this.isLoading = false;
      this.tosatr.error(error['statusText'] +". "+error.error.message);
    })
  }
  openCreateCompanyModal(){
    this.myModals.show();
  }

  selectedTab(index: number) {
    console.log(index)
    this.activeTab = index;
  }
}
