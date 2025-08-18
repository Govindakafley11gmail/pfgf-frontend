import {TestBed} from '@angular/core/testing';

import {PfemployeeService} from './pfemployee.service';

describe('PfemployeeService', () => {
  let service: PfemployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PfemployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
