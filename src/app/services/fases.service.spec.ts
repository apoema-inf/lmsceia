import { TestBed, inject } from '@angular/core/testing';

import { FasesService } from './fases.service';

describe('FasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FasesService]
    });
  });

  it('should be created', inject([FasesService], (service: FasesService) => {
    expect(service).toBeTruthy();
  }));
});
