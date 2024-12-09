import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacesComponent } from './spaces.component';

describe('SpacesComponent', () => {
  let component: SpacesComponent;
  let fixture: ComponentFixture<SpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
