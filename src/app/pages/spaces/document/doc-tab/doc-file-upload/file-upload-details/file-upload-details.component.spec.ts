import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadDetailsComponent } from './file-upload-details.component';

describe('FileUploadDetailsComponent', () => {
  let component: FileUploadDetailsComponent;
  let fixture: ComponentFixture<FileUploadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileUploadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
