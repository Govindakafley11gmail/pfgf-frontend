import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeloanComponent } from './employeeloan.component';

describe('EmployeeloanComponent', () => {
  let component: EmployeeloanComponent;
  let fixture: ComponentFixture<EmployeeloanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeloanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeloanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
