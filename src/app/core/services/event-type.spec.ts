import { TestBed } from '@angular/core/testing';

import { EventTypeService } from './event-type';

describe('EventTypeService', () => {
  let service: EventTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
