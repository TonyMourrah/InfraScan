import { TestBed } from '@angular/core/testing';

import { Actif } from './actif';

describe('Actif', () => {
  let service: Actif;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Actif);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
