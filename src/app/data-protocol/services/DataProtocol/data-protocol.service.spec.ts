import { TestBed } from '@angular/core/testing';

import { DataProtocolService } from './data-protocol.service';

describe('DataProtocolService', () => {
  let service: DataProtocolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProtocolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
