import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementDaysComponent } from './replacement-days.component';

describe('ReplacementDaysComponent', () => {
  let component: ReplacementDaysComponent;
  let fixture: ComponentFixture<ReplacementDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementDaysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
