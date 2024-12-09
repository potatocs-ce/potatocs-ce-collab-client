import { Injectable, WritableSignal, signal } from "@angular/core";
import { MemberDataStorageService } from "../member-data-storage/member-data-storage.service";
@Injectable({
	providedIn: "root",
})
export class ScrumboardStorageService {
	member: WritableSignal<any> = this.mdsService.member;
	scrum: WritableSignal<any | null> = signal<any | null>(null);

	constructor(private mdsService: MemberDataStorageService) {}

	updateScrumBoard(scrums: any) {
		const spaceMember = this.member()[0].memberObjects;
		const my_scrum = scrums.scrum;

		for (let scrum of my_scrum) {
			for (let scrumChild of scrum.children) {
				scrumChild.creator = scrumChild.creator.map((creator) => {
					return spaceMember.find((member) => member._id == creator);
				});
			}
		}
		this.scrum.set(scrums);
	}
}
