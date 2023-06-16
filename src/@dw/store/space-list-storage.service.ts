import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SpaceListStorageService {

	private spaceList$: BehaviorSubject<any>;
	space$: Observable<any>;

	constructor( 
		
	) {
		this.spaceList$ = new BehaviorSubject([]);
		this.space$ = this.spaceList$.asObservable();
	}

	updateSpaceList(spaceData: any) {
		this.spaceList$.next(spaceData);
	}
	
}