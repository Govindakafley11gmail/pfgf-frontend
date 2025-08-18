import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GfEmployeeRegistrationComponent} from './gf-employee-registration.component';

describe('GfEmployeeRegistrationComponent', () => {
  let component: GfEmployeeRegistrationComponent;
  let fixture: ComponentFixture<GfEmployeeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GfEmployeeRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GfEmployeeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
