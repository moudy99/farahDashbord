import { TestBed } from '@angular/core/testing';

import { ServicesManagementService } from './services-management.service';

describe('ServicesManagementService', () => {
  let service: ServicesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
