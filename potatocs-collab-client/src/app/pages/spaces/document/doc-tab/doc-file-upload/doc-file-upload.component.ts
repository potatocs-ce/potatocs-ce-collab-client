import { Component, effect, HostListener, Input, OnInit, Signal, ViewChild } from "@angular/core";

import { DocDataStorageService } from "../../../../../stores/doc-data-storage.service";
import { DocumentsService } from "../../../../../services/spaces/documents.service";
import { saveAs } from "file-saver";
import { DialogService } from "../../../../../stores/dialog/dialog.service";
// table page
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { fromEvent, Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { FileUploadDescriptionComponent } from "./file-upload-description/file-upload-description.component";
import { FileUploadDetailsComponent } from "./file-upload-details/file-upload-details.component";
import { MaterialsModule } from "../../../../../materials/materials.module";

// view table
export interface PeriodicElement {
    FileName: String;
    Uploader: String;
}
@Component({
    selector: "app-doc-file-upload",
    templateUrl: "./doc-file-upload.component.html",
    styleUrls: ["./doc-file-upload.component.scss"],
    standalone: true,
    imports: [MaterialsModule],
})
export class DocFileUploadComponent implements OnInit {
    mobileWidth: any;
    pageSizeOptions;

    // 브라우저 크기 변화 체크 ///
    resizeObservable$: Observable<Event>;
    resizeSubscription$: Subscription;
    ///////////////////////

    @Input() docId: string;
    private unsubscribe$ = new Subject<void>();

    docs: Signal<any> = this.ddsService.docs;
    files: Signal<any> = this.ddsService.files;
    constructor(
        // public dialog: MatDialog,
        private docService: DocumentsService,
        private ddsService: DocDataStorageService,
        private dialogService: DialogService,
        public dialog: MatDialog
    ) {
        this.onResize(); // 호출하여 변수 초기화해줘야 함.
        effect(() => {
            this.filesArray = new MatTableDataSource<PeriodicElement>(this.docs());
            this.filesArray.paginator = this.paginator;
        });
    }

    displayedColumns: string[] = ["name", "creator", "download", "delete"];
    public fileData: File;
    public fileName = "";
    public uploadFileInfo;
    public filesArray: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ////////////////////////////////////
    // 브라우저 크기
    @HostListener("window:resize", ["$event"])
    onResize(event?) {
        this.mobileWidth = window.innerWidth;

        // console.log(this.mobileWidth)

        if (this.mobileWidth <= 780) {
            this.pageSizeOptions = 5;
        } else {
            this.pageSizeOptions = 10;
        }
    }
    ///////////////////////

    ngOnInit(): void {
        this.getUploadFileList(this.docId);
        ////////////////////////////////////
        this.mobileWidth = window.screen.width;
        // 브라우저 크기 변화 체크
        this.resizeObservable$ = fromEvent(window, "resize");
        this.resizeSubscription$ = this.resizeObservable$.subscribe((evt) => {
            // console.log('event: ', evt)
        });
        ////////////////////////////////////
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.resizeSubscription$.unsubscribe();
    }

    fileChangeEvent(data) {
        console.log(data.target.files[0]);
        this.fileData = data.target.files[0];
        this.fileName = this.fileData.name;
    }
    uploadFileDelete() {
        this.fileName = "";
        this.fileData = undefined;
    }

    fileUpload() {
        if (!this.fileData) {
            this.dialogService.openDialogNegative("Please, select a file to upload.");
            // alert('Please, select a file to upload.');
        } else {
            this.openFileUploadDescription();
        }
    }

    // 업로드 다이어로그 description 넣는 곳
    openFileUploadDescription() {
        const dialogRef = this.dialog.open(FileUploadDescriptionComponent, {
            data: {
                fileData: this.fileData,
                docId: this.docId,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            console.log("the file upload description dialog closed");
            // result 에 값이 오면 업로드
            if (result) {
                this.docService.fileUpload(result.fileData, result.docId, result.description).subscribe(
                    (data: any) => {
                        if (data.message == "filesend") {
                            this.getUploadFileList(this.docId);
                            console.log("connected");
                            this.dialogService.openDialogPositive("Successfully, the file has been uploaded.");
                        }
                    },
                    (err: any) => {
                        console.log(err);
                    }
                );
            }
        });
    }
    openFileUploadDetail(fileData) {
        const dialogRef = this.dialog.open(FileUploadDetailsComponent, {
            data: {
                fileData: fileData,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log(result);
            console.log("the file upload detail dialog closed");
        });
    }
    getUploadFileList(docId) {
        this.docService.getUploadFileList({ docId }).subscribe(
            (data: any) => {
                // console.log(data);
                const uploadFileList = data.findFileList;
                // console.log(uploadFileList);
                this.files().set(uploadFileList);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    // https://stackoverflow.com/questions/50039015/how-to-download-a-pdf-file-from-an-url-in-angular-5
    fileDownload(data) {
        // saveAs("/uploads/upload_file/" + fileData.filename, fileData.originalname, { type: fileData.fileType });
        this.docService.fileDownload(data._id).subscribe((res) => {
            console.log(res);
            const blob = res;
            saveAs(blob, data.originalname);
        });
        // console.log(fileData)
        //this.dialogService.openDialogPositive('succeed file download!');
    }

    deleteUploadFile(fileId) {
        console.log("delete upload fileeeee");
        // const result = confirm('파일을 삭제하시겠습니까?');
        // if(result){
        console.log(fileId);
        this.dialogService.openDialogConfirm("Do you want to delete the file?").subscribe((result) => {
            if (result) {
                this.docService.deleteUploadFile({ fileId }).subscribe({
                    next: (data: any) => {
                        console.log(data);
                        this.getUploadFileList(this.docId);
                        this.dialogService.openDialogPositive("Successfully, the file has been deleted.");
                    },
                    error: (err: any) => {
                        console.log(err);
                    },
                });
            }
        });
    }
}
