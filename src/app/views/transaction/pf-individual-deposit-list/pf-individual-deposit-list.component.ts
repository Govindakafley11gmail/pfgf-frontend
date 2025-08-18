import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pf-individual-deposit-list',
  templateUrl: './pf-individual-deposit-list.component.html',
  styleUrls: ['./pf-individual-deposit-list.component.scss']
})
export class PfIndividualDepositListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  pending
  pendingtoggle
  approvedtoggle
  approved
  constructor() { }

  ngOnInit(): void {
    this. depositPendingData()
  }

  depositPendingData() {
    this.pendingtoggle =true
    this.pending =true;
    this.approvedtoggle =false;
    this.approved =false;
  }

  depositApprovedData() {
    this.pendingtoggle =false
    this.approvedtoggle =true
    this.approved =true;
    this.pending = false;
  }
}
