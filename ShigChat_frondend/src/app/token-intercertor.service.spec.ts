import { TestBed } from '@angular/core/testing';

import { TokenIntercertorService } from './token-intercertor.service';

describe('TokenIntercertorService', () => {
  let service: TokenIntercertorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenIntercertorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
