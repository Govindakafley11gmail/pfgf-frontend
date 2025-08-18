import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RefundcompletedlistComponent} from './refundcompletedlist.component';

describe('RefundcompletedlistComponent', () => {
  let component: RefundcompletedlistComponent;
  let fixture: ComponentFixture<RefundcompletedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundcompletedlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundcompletedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
