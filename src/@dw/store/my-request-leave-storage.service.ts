import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyRequestLeaveStorageService {

  private myRequestLeave$: BehaviorSubject<any>;
	myRequestLeaveData: Observable<any>;

	constructor() { 
		this.myRequestLeave$ = new BehaviorSubject([]);
		this.myRequestLeaveData = this.myRequestLeave$.asObservable();
	}

	updateMyRequestLeave(myRequestLeaveData: any) {
		this.myRequestLeave$.next(myRequestLeaveData);
	}

}
