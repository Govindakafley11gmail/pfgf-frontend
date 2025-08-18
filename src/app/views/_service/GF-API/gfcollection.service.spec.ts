import {TestBed} from '@angular/core/testing';

import {GfcollectionService} from './gfcollection.service';

describe('GfcollectionService', () => {
  let service: GfcollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GfcollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
