import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RefundpendingprocessComponent} from './refundpendingprocess.component';

describe('RefundpendingprocessComponent', () => {
  let component: RefundpendingprocessComponent;
  let fixture: ComponentFixture<RefundpendingprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundpendingprocessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundpendingprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
