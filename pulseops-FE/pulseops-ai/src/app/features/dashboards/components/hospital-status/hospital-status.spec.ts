import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalStatus } from './hospital-status';

describe('HospitalStatus', () => {
  let component: HospitalStatus;
  let fixture: ComponentFixture<HospitalStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(HospitalStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
