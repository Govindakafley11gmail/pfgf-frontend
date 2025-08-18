import {TestBed} from '@angular/core/testing';

import {PfserviceService} from './pfservice.service';

describe('PfserviceService', () => {
  let service: PfserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PfserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
