import { TestBed } from '@angular/core/testing';

import { Cleaner } from './cleaner';

describe('Cleaner', () => {
  let service: Cleaner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cleaner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
