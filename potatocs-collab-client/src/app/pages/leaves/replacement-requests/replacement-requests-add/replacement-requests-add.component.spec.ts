import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementRequestsAddComponent } from './replacement-requests-add.component';

describe('ReplacementRequestsAddComponent', () => {
  let component: ReplacementRequestsAddComponent;
  let fixture: ComponentFixture<ReplacementRequestsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacementRequestsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplacementRequestsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
