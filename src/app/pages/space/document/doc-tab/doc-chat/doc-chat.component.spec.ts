import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocChatComponent } from './doc-chat.component';

describe('DocChatComponent', () => {
  let component: DocChatComponent;
  let fixture: ComponentFixture<DocChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
