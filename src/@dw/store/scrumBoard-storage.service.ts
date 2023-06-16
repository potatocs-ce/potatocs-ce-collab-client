import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MemberDataStorageService } from './member-data-storage.service';

@Injectable({
	providedIn: 'root'
})


export class ScrumBoardStorageService {



	private scrumBoard$: BehaviorSubject<any>;
	scrum$: Observable<any>


	// 스페이스의 멤버
	private spaceObj;
	private spaceMember;


	constructor(
		private memberDataStorageService: MemberDataStorageService
	) {
		this.scrumBoard$ = new BehaviorSubject([]);
		this.scrum$ = this.scrumBoard$.asObservable();
	}

	updateScrumBoard(scrums: any) {


		const spaceObj = this.memberDataStorageService.state;
		const spaceMember = spaceObj[0].memberObjects;
		const my_scrum = scrums.scrum;
	



		//scrum.scrum.children.creator 가 서버에서 올때 id만 가지고있는데, 여기에 id,name,profile-image,isRetired의 값으로 바꿔치기해줌
		for (let scrum of my_scrum) {
			for (let scrumChild of scrum.children) {

				scrumChild.creator = scrumChild.creator.map((creator) => {
					return spaceMember.find((member) => member._id == creator);
				});
			}
		}


		this.scrumBoard$.next(scrums);
	}

}