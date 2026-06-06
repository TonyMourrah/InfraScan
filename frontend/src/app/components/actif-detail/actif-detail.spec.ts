import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActifDetail } from './actif-detail';

describe('ActifDetail', () => {
  let component: ActifDetail;
  let fixture: ComponentFixture<ActifDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActifDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ActifDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
