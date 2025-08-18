import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfstatementEmployeeWiseComponent} from './pfstatement-employee-wise.component';

describe('PfstatementEmployeeWiseComponent', () => {
  let component: PfstatementEmployeeWiseComponent;
  let fixture: ComponentFixture<PfstatementEmployeeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfstatementEmployeeWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfstatementEmployeeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
