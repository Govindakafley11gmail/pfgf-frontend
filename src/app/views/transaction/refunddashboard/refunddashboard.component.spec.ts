import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RefunddashboardComponent} from './refunddashboard.component';

describe('RefunddashboardComponent', () => {
  let component: RefunddashboardComponent;
  let fixture: ComponentFixture<RefunddashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefunddashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefunddashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
