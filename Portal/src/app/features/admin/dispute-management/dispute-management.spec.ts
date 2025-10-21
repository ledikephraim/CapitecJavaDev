import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeManagement } from './dispute-management';

describe('DisputeManagement', () => {
  let component: DisputeManagement;
  let fixture: ComponentFixture<DisputeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
