import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundApprovalComponent } from './refund-approval.component';

describe('RefundApprovalComponent', () => {
  let component: RefundApprovalComponent;
  let fixture: ComponentFixture<RefundApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
