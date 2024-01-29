import { TestBed } from '@angular/core/testing';

import { DataProtocolTagService } from './data-protocol-tag.service';

describe('DataProtocolTagService', () => {
  let service: DataProtocolTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProtocolTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
