import { TestBed } from '@angular/core/testing';

import { WorldgenService } from './worldgen.service';

describe('WorldgenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorldgenService = TestBed.get(WorldgenService);
    expect(service).toBeTruthy();
  });
});
