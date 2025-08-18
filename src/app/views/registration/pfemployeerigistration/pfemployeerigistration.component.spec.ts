import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfemployeerigistrationComponent} from './pfemployeerigistration.component';

describe('PfemployeerigistrationComponent', () => {
  let component: PfemployeerigistrationComponent;
  let fixture: ComponentFixture<PfemployeerigistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfemployeerigistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfemployeerigistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
