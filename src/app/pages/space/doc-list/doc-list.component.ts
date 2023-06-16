import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { DialogSpaceMemberComponent } from '../space.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodicElement } from '../document/doc-tab/doc-file-upload/doc-file-upload.component';
import { MatSort } from '@angular/material/sort';
import { DialogService } from 'src/@dw/dialog/dialog.service';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@Input() spaceInfo: any;
	@Input() spaceTime: any;
	private unsubscribe$ = new Subject<void>();
	// public spaceTime: String;
	public docsArray: any;
	displayedColumns: string[] = ['status', 'period', 'docTitle','creator', 'createdAt'];
	constructor(
		private route: ActivatedRoute,
		private ddsService: DocDataStorageService,
		private router: Router,
		public dialog: MatDialog,
		private dialogService : DialogService,

	) { 

	}

	ngOnInit(): void {
		// this.spaceTime = this.route.snapshot.params.spaceTime;
		this.ddsService.docs$.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
			(data: any) => {
				this.docsArray = data;


				console.log(this.docsArray);
                this.docsArray = new MatTableDataSource<PeriodicElement>(data);
				this.docsArray.paginator = this.paginator;
				this.docsArray.sort = this.sort;
				console.log(this.docsArray);
				console.log(this.spaceInfo);
				// this.docsArray.paginator = this.paginator;
			},
			(err: any) => {
				return;
			}
		);			
	}

	ngAfterViewInit() {
		this.docsArray.paginator = this.paginator;
		this.docsArray.sort = this.sort;
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	
	}

	openDoc(docId) {

		const docQuery = {
			id: docId
		}
		console.log(docQuery);
		const spaceId = this.spaceTime;
		this.spaceTime = '';
		this.router.navigate(['collab/space/'+spaceId+'/doc'], { queryParams: docQuery });
	}


	sharingDocumentBtn(){
		const editorQuery = {
			spaceTime: this.spaceTime,
			spaceTitle: this.spaceInfo.displayName,
		}
		console.log(this.spaceInfo.docStatus);
		if(this.spaceInfo.docStatus.length<1){
			this.dialogService.openDialogNegative("Status does not exist.")
		}
		else{
		this.router.navigate(['collab/editor/ctDoc'], { queryParams: editorQuery });
		}
	}

	inviteMemberBtn(): void {
		console.log('openSpaceMemeber');
		const dialogRef = this.dialog.open(DialogSpaceMemberComponent, {
			width: '600px',
			height: '300px',
			data: {
				spaceTime: this.spaceTime,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog setting was closed');
			// this.getMembers();
			// if (result == null || result == '') {

			// } else {

			// }
		});
	}

}
