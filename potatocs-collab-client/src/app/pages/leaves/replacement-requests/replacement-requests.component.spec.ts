import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementRequestsComponent } from './replacement-requests.component';

describe('ReplacementRequestsComponent', () => {
  let component: ReplacementRequestsComponent;
  let fixture: ComponentFixture<ReplacementRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
