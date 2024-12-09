import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CalendarEvent } from "angular-calendar";
import { DocumentsService } from "../../../../services/spaces/documents.service";
import { MaterialsModule } from "../../../../materials/materials.module";
import { FlatpickrModule } from "angularx-flatpickr";
@Component({
	selector: "app-calendar-edit",
	standalone: true,
	imports: [MaterialsModule, FlatpickrModule],
	templateUrl: "./calendar-edit.component.html",
	styleUrl: "./calendar-edit.component.scss",
})
export class CalendarEditComponent implements OnInit, AfterViewInit {
	form = this.fb.group({
		docId: null,
		title: null,
		start: null,
		end: null,
	});
	docId;
	constructor(
		private dialogRef: MatDialogRef<CalendarEditComponent>,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private docService: DocumentsService,
		@Inject(MAT_DIALOG_DATA) public event: CalendarEvent<any>
	) {}

	ngOnInit(): void {}
	ngAfterViewInit(): void {
		setTimeout(() => {
			this.form.patchValue(this.event);
			console.log(this.event);
			// 어떤 추가 초기화 작업이 필요한 경우 여기에 작성
		});
	}
	save() {
		console.log(this.form.value);
		const data = {
			_id: this.form.value.docId,
			docTitle: this.form.value.title,
			startDate: this.form.value.start,
			endDate: this.form.value.end,
		};

		this.docService.editDocDate(data).subscribe({
			next: (data: any) => {
				console.log(data);
			},
			error: (err: any) => {
				console.log(err);
			},
		});
		console.log(this.event);
		console.log(this.form.value);
		this.dialogRef.close({
			...this.event,
			...this.form.value,
		});
	}
}
