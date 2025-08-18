import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExcessPaymentDashboardComponent} from './excess-payment-dashboard.component';

describe('ExcessPaymentDashboardComponent', () => {
  let component: ExcessPaymentDashboardComponent;
  let fixture: ComponentFixture<ExcessPaymentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcessPaymentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcessPaymentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
