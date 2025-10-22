import { TestBed } from '@angular/core/testing';

import { Coordinator } from './coordinator';

describe('Coordinator', () => {
  let service: Coordinator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Coordinator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
