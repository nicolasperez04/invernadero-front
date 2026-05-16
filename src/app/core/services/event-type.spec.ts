import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { EventTypeService } from './event-type';

describe('EventTypeService', () => {
  let service: EventTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(EventTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
