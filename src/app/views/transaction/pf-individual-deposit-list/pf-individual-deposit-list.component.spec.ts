import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfIndividualDepositListComponent} from './pf-individual-deposit-list.component';

describe('PfIndividualDepositListComponent', () => {
  let component: PfIndividualDepositListComponent;
  let fixture: ComponentFixture<PfIndividualDepositListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfIndividualDepositListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfIndividualDepositListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
