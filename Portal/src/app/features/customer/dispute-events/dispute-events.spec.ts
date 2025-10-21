import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeEvents } from './dispute-events';

describe('DisputeEvents', () => {
  let component: DisputeEvents;
  let fixture: ComponentFixture<DisputeEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
