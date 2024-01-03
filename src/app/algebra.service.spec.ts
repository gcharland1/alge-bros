import { TestBed } from '@angular/core/testing';

import { AlgebraService } from './algebra.service';

describe('AlgebraService', () => {
  let service: AlgebraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgebraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
