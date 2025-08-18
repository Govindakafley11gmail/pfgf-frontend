import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GfregistrationComponent} from './gfregistration.component';

describe('GfregistrationComponent', () => {
  let component: GfregistrationComponent;
  let fixture: ComponentFixture<GfregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GfregistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GfregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
