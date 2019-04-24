import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeBigComponent } from './time-big.component';

describe('TimeBigComponent', () => {
  let component: TimeBigComponent;
  let fixture: ComponentFixture<TimeBigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeBigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
