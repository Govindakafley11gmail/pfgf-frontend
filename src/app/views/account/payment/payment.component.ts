import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  toggles
  pending
  toggless
  approved
  pendingtoggle
  approvedtoggle

  constructor() { }

  ngOnInit(): void {
    this.refundPendingData();
  }
  refundPendingData(){
    this.toggles =true
    this.pending =true;
    this.toggless =false;
    this.approved =false;
    this.pendingtoggle = true
    this.approvedtoggle = false
  }
  paymentApprovedData(){
    this.toggles =false
    this.toggless =true
    this.approved =true;
    this.pending = false;
    this.pendingtoggle = false
    this.approvedtoggle = true
  }

}
