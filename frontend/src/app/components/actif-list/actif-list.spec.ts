import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActifList } from './actif-list';

describe('ActifList', () => {
  let component: ActifList;
  let fixture: ComponentFixture<ActifList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActifList],
    }).compileComponents();

    fixture = TestBed.createComponent(ActifList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
