import { TestBed } from '@angular/core/testing';

import { DataSubProtocolTagService } from './data-sub-protocol-tag.service';

describe('DataSubProtocolTagService', () => {
  let service: DataSubProtocolTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSubProtocolTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
