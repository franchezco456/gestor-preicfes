import { TestBed } from '@angular/core/testing';

import { AlertCtrl } from './alert-ctrl';

describe('AlertCtrl', () => {
  let service: AlertCtrl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertCtrl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
