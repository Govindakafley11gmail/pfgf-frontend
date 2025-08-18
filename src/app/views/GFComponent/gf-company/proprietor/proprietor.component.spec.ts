import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProprietorComponent} from './proprietor.component';

describe('ProprietorComponent', () => {
  let component: ProprietorComponent;
  let fixture: ComponentFixture<ProprietorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProprietorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProprietorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
