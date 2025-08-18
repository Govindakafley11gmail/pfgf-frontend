import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-refunddashboard',
  templateUrl: './refunddashboard.component.html',
  styleUrls: ['./refunddashboard.component.scss']
})

export class RefunddashboardComponent implements OnInit {
  // @ViewChild('myModal') public myModal: ModalDirective;
  // @ViewChild('myModals') public myModals: ModalDirective;
  // // @ViewChild('myModal') public myModal: ModalDirective;
  // dtOptions: DataTables.Settings = {};
  // dtTrigger: Subject<any> = new Subject<any>();

  constructor() {

}

  toggle = true;
  toggles = true;
  toggless = true;
  refund = true
  pending
  approved
  refundList
  subscription: Subscription
  approvedorpendind;
  completed
  refundCreate
  toggles1
  refview= true
  //

  ngOnInit() {
   this. refundPendingData()
  }

  refundPendingData() {
    this.refview = false;
    this.completed = false;
    this.toggle = false
    this.toggles = true;
    this.toggless = false;
    this.refund = false
    this.pending = true
    this.approved = false
    this.refundCreate = false
    this.toggles1 = false
    this.approverefund = false

  }

  refundApprovedData() {
    this.refview = false;
    this.completed = false;
    this.toggle = false
    this.toggles = false;
    this.toggless = true;
    this.refund = false
    this.pending = false
    this.approved = true
    this.refundCreate = false
    this.toggles1 = false
    this.approverefund = false

  }


  approverefund

  refundCompletedData() {
    this.refview = false;
    this.completed = true;
    this.toggle = true
    this.approverefund = false
    this.toggles = false;
    this.toggless = false;
    this.refund = false
    this.pending = false
    this.approved = false
    this.refundCreate = false
    this.toggles1 = false


  }
  refundpendindViewData(){
    this.refview = true;
    this.completed = false;
    this.toggle = false
    this.toggles = false;
    this.toggless = false;
    this.refund = false
    this.pending = false
    this.approved = false
    this.refundCreate = false
    this.toggles1 = false
    this.approverefund = false
  }
}
