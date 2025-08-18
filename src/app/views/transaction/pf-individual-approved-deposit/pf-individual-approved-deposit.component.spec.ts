import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfIndividualApprovedDepositComponent} from './pf-individual-approved-deposit.component';

describe('PfIndividualApprovedDepositComponent', () => {
  let component: PfIndividualApprovedDepositComponent;
  let fixture: ComponentFixture<PfIndividualApprovedDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfIndividualApprovedDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfIndividualApprovedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
