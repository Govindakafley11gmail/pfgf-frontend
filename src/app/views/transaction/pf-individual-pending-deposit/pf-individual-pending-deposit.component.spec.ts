import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfIndividualPendingDepositComponent} from './pf-individual-pending-deposit.component';

describe('PfIndividualPendingDepositComponent', () => {
  let component: PfIndividualPendingDepositComponent;
  let fixture: ComponentFixture<PfIndividualPendingDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfIndividualPendingDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfIndividualPendingDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
