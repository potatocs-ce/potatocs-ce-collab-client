import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFileUploadComponent } from './doc-file-upload.component';

describe('DocFileUploadComponent', () => {
  let component: DocFileUploadComponent;
  let fixture: ComponentFixture<DocFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
