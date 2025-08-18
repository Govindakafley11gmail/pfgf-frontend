import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PaymentApprovedComponent} from './payment-approved.component';

describe('PaymentApprovedComponent', () => {
  let component: PaymentApprovedComponent;
  let fixture: ComponentFixture<PaymentApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentApprovedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
