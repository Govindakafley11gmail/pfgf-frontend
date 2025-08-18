import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountPostingComponent} from './account-posting.component';

describe('AccountPostingComponent', () => {
  let component: AccountPostingComponent;
  let fixture: ComponentFixture<AccountPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
