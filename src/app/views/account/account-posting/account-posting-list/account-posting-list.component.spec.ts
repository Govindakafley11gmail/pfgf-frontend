import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPostingListComponent } from './account-posting-list.component';

describe('AccountPostingListComponent', () => {
  let component: AccountPostingListComponent;
  let fixture: ComponentFixture<AccountPostingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPostingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPostingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
