import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEditComponent } from './calendar-edit.component';

describe('CalendarEditComponent', () => {
  let component: CalendarEditComponent;
  let fixture: ComponentFixture<CalendarEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
