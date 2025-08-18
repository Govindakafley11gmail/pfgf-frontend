import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PFOrganisationRegistrationComponent} from './p-forganisation-registration.component';

describe('PFOrganisationRegistrationComponent', () => {
  let component: PFOrganisationRegistrationComponent;
  let fixture: ComponentFixture<PFOrganisationRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PFOrganisationRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PFOrganisationRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
