import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DocDataStorageService {

	private docsSubject$: BehaviorSubject<any>;
	docs$: Observable<any>;

	private uploadFile$: BehaviorSubject<any>;
	file$: Observable<any>

	constructor( 
		
	) {
		this.docsSubject$ = new BehaviorSubject([]);
		this.docs$ = this.docsSubject$.asObservable();

		this.uploadFile$ = new BehaviorSubject([]);
		this.file$ = this.uploadFile$.asObservable();
	}

	updateDocs(docsData: any) {
		this.docsSubject$.next(docsData);
	}

	updataFiles(file: any){
		this.uploadFile$.next(file);
	}
}