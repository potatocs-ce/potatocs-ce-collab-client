import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumboardSummaryComponent } from './scrumboard-summary.component';

describe('ScrumboardSummaryComponent', () => {
  let component: ScrumboardSummaryComponent;
  let fixture: ComponentFixture<ScrumboardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrumboardSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrumboardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
