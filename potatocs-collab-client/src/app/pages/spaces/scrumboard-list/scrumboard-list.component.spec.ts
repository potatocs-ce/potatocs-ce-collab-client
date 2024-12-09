import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumboardListComponent } from './scrumboard-list.component';

describe('ScrumboardListComponent', () => {
  let component: ScrumboardListComponent;
  let fixture: ComponentFixture<ScrumboardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumboardListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrumboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
