import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAlerts } from './active-alerts';

describe('ActiveAlerts', () => {
  let component: ActiveAlerts;
  let fixture: ComponentFixture<ActiveAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
