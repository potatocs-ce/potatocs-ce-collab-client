import { Injectable, WritableSignal, signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
	providedIn: "root",
})
export class DocDataStorageService {
	docs: WritableSignal<any | null> = signal<any | null>(null);
	files: WritableSignal<any | null> = signal<any>([]);

	private uploadFile$: BehaviorSubject<any>;
	file$: Observable<any>;
	constructor() {
		this.uploadFile$ = new BehaviorSubject([]);
		this.file$ = this.uploadFile$.asObservable();
	}

	updataFiles(file: any) {
		this.uploadFile$.next(file);
	}
}
