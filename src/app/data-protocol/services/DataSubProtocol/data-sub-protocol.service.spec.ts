import { TestBed } from '@angular/core/testing';

import { DataSubProtocolService } from './data-sub-protocol.service';

describe('DataSubProtocolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSubProtocolService = TestBed.get(DataSubProtocolService);
    expect(service).toBeTruthy();
  });
});
