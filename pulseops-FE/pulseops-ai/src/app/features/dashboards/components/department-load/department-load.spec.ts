import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentLoad } from './department-load';

describe('DepartmentLoad', () => {
  let component: DepartmentLoad;
  let fixture: ComponentFixture<DepartmentLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentLoad],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentLoad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
