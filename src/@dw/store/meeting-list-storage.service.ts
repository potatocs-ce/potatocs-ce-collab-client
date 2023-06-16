import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MeetingListStorageService {

	private meetingList$: BehaviorSubject<any>;
	meeting$: Observable<any>;

	constructor( 
		
	) {
		this.meetingList$ = new BehaviorSubject([]);
		this.meeting$ = this.meetingList$.asObservable();
	}

	updateMeetingList(meetingData: any) {
		this.meetingList$.next(meetingData);
	}
	
}