import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeDetail } from './dispute-detail';

describe('DisputeDetail', () => {
  let component: DisputeDetail;
  let fixture: ComponentFixture<DisputeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisputeDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
