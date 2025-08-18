import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PfRegistrationListComponent} from './pf-registration-list.component';

describe('PfRegistrationListComponent', () => {
  let component: PfRegistrationListComponent;
  let fixture: ComponentFixture<PfRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PfRegistrationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PfRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
