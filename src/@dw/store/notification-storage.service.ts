import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationStorageService {

  private myNotification$: BehaviorSubject<any>;
	myNotificationData: Observable<any>;

	constructor() { 
		this.myNotification$ = new BehaviorSubject([]);
		this.myNotificationData = this.myNotification$.asObservable();
	}

	updateMyNotificationLeave(myNotificationData: any) {
		this.myNotification$.next(myNotificationData);
	}

}
