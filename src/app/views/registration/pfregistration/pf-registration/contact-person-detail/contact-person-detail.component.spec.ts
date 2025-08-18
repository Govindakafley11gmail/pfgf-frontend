import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContactPersonDetailComponent} from './contact-person-detail.component';

describe('ContactPersonDetailComponent', () => {
  let component: ContactPersonDetailComponent;
  let fixture: ComponentFixture<ContactPersonDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPersonDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
