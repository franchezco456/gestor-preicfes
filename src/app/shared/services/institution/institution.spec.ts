import { TestBed } from '@angular/core/testing';

import { Institution } from './institution';

describe('Institution', () => {
  let service: Institution;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Institution);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
