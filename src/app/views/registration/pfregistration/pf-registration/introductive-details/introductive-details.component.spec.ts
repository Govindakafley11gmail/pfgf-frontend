import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IntroductiveDetailsComponent} from './introductive-details.component';

describe('IntroductiveDetailsComponent', () => {
  let component: IntroductiveDetailsComponent;
  let fixture: ComponentFixture<IntroductiveDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroductiveDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
