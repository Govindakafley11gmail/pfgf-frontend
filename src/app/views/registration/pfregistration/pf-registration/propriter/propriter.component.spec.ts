import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PropriterComponent} from './propriter.component';

describe('PropriterComponent', () => {
  let component: PropriterComponent;
  let fixture: ComponentFixture<PropriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropriterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
