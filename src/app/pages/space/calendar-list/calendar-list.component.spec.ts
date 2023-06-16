import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarListComponent } from './calendar-list.component';

describe('CalendarListComponent', () => {
  let component: CalendarListComponent;
  let fixture: ComponentFixture<CalendarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
