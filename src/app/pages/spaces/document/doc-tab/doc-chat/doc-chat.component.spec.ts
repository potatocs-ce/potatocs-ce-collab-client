import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocChatComponent } from './doc-chat.component';

describe('DocChatComponent', () => {
  let component: DocChatComponent;
  let fixture: ComponentFixture<DocChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
