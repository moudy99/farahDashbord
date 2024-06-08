import { TestBed } from '@angular/core/testing';

import { BeautyCenterService } from './beauty-center.service';

describe('BeautyCenterService', () => {
  let service: BeautyCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeautyCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
