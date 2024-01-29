import { TestBed } from '@angular/core/testing';

import { DataSubProtocolDhTagService } from './data-sub-protocol-dh-tag.service';

describe('DataSubProtocolDhTagService', () => {
  let service: DataSubProtocolDhTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSubProtocolDhTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
