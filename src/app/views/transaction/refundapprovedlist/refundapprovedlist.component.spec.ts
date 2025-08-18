import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RefundapprovedlistComponent} from './refundapprovedlist.component';

describe('RefundapprovedlistComponent', () => {
  let component: RefundapprovedlistComponent;
  let fixture: ComponentFixture<RefundapprovedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundapprovedlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundapprovedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
