import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CropService } from './crop';

describe('CropService', () => {
  let service: CropService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
