import { TestBed } from '@angular/core/testing';

import { GetColorService } from './get-color.service';

describe('GetColorService', () => {
  let service: GetColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
