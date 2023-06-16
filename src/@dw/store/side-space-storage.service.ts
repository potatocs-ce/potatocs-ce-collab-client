import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideSpaceStorageService {

	private pendingDataSubject$: BehaviorSubject<any>;
	pendingData: Observable<any>;

	constructor() { 
		this.pendingDataSubject$ = new BehaviorSubject([]);
		this.pendingData = this.pendingDataSubject$.asObservable();
	}

	updatePendingRequest(pendingData: any) {
		this.pendingDataSubject$.next(pendingData);
	}

}
