import { TestBed } from '@angular/core/testing';

import { PageHeaderService } from './page-header';

describe('PageHeader', () => {
  let service: PageHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
