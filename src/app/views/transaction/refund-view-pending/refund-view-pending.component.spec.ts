import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundViewPendingComponent } from './refund-view-pending.component';

describe('RefundViewPendingComponent', () => {
  let component: RefundViewPendingComponent;
  let fixture: ComponentFixture<RefundViewPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundViewPendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundViewPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
