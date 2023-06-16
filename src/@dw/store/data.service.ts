import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	private userProfileSubject = new BehaviorSubject({});
	userProfile = this.userProfileSubject.asObservable();

	private userManagerProfileSubject = new BehaviorSubject({});
	userManagerProfile = this.userManagerProfileSubject.asObservable();

	private userCompanyProfileSubject = new BehaviorSubject({});
	userCompanyProfile = this.userCompanyProfileSubject.asObservable();

	constructor( 
		
	) {

	}

	updateUserProfile(profileData: any) {
		// console.log('updatedData', profileData);
		this.userProfileSubject.next(profileData);
	}

	updateUserManagerProfile(profileData: any) {
		// console.log('updatedData', profileData);
		this.userManagerProfileSubject.next(profileData);
	}

	updateUserCompanyProfile(profileData: any) {
		// console.log('updatedData', profileData);
		this.userCompanyProfileSubject.next(profileData);
	}
}