import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingSetComponent } from './meeting-set.component';

describe('MeetingSetComponent', () => {
  let component: MeetingSetComponent;
  let fixture: ComponentFixture<MeetingSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeetingSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
