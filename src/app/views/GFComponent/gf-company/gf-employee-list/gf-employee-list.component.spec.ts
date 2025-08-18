import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GfEmployeeListComponent} from './gf-employee-list.component';

describe('GfEmployeeListComponent', () => {
  let component: GfEmployeeListComponent;
  let fixture: ComponentFixture<GfEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GfEmployeeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GfEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
