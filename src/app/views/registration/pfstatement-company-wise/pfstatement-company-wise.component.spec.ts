import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfstatementCompanyWiseComponent} from './pfstatement-company-wise.component';

describe('PfstatementCompanyWiseComponent', () => {
  let component: PfstatementCompanyWiseComponent;
  let fixture: ComponentFixture<PfstatementCompanyWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfstatementCompanyWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfstatementCompanyWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
