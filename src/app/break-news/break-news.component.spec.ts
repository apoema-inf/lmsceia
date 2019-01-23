import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakNewsComponent } from './break-news.component';

describe('BreakNewsComponent', () => {
  let component: BreakNewsComponent;
  let fixture: ComponentFixture<BreakNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
