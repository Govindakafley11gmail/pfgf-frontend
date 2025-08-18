import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfemployeerigistrationlistComponent} from './pfemployeerigistrationlist.component';

describe('PfemployeerigistrationlistComponent', () => {
  let component: PfemployeerigistrationlistComponent;
  let fixture: ComponentFixture<PfemployeerigistrationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfemployeerigistrationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfemployeerigistrationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
