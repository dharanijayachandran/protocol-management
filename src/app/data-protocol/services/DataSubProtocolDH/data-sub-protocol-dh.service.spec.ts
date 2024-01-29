import { TestBed } from '@angular/core/testing';

import { DataSubProtocolDHService } from './data-sub-protocol-dh.service';

describe('DataSubProtocolDHService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSubProtocolDHService = TestBed.get(DataSubProtocolDHService);
    expect(service).toBeTruthy();
  });
});
