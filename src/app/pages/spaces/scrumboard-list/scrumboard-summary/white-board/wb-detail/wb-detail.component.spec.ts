import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WbDetailComponent } from './wb-detail.component';

describe('WbDetailComponent', () => {
  let component: WbDetailComponent;
  let fixture: ComponentFixture<WbDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WbDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WbDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
