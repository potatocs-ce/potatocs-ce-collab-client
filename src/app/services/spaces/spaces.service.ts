import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { tap } from "rxjs/operators";
import { MemberDataStorageService } from "../../stores/member-data-storage/member-data-storage.service";
import { DocDataStorageService } from "../../stores/doc-data-storage.service";
import { ScrumboardStorageService } from "../../stores/scrumboard-storage/scrumboard-storage.service";

@Injectable({
	providedIn: "root",
})
export class SpacesService {
	private baseUrl = environment.apiUrl;

	member: WritableSignal<any> = this.mdsService.member;
	docs: WritableSignal<any> = this.ddsService.docs;
	constructor(
		private http: HttpClient,
		private mdsService: MemberDataStorageService,
		private ddsService: DocDataStorageService,
		private scrumService: ScrumboardStorageService
	) {}

	getSpaceMembers(spaceTime) {
		return this.http.get(this.baseUrl + "/collab/space/" + spaceTime).pipe(
			tap((res: any) => {
				this.member.set(res.spaceMembers);
				this.docs.set(res.spaceDocs);
				this.scrumService.updateScrumBoard(res.scrumBoard);
				return res.message;
			})
		);
	}

	deleteSpace(spaceTime) {
		console.log("delete space");
		return this.http.delete(this.baseUrl + "/collab/space/deleteSpace", { params: spaceTime });
	}

	changeSpaceName(data) {
		return this.http.put(this.baseUrl + "/collab/space/change-space-name", data);
	}

	changeSpaceBrief(data) {
		return this.http.put(this.baseUrl + "/collab/change-space-brief", data);
	}

	quitSpaceAdmin(data) {
		return this.http.put(this.baseUrl + "/collab/quit-space-admin", data);
	}

	addSpaceAdmin(data) {
		return this.http.put(this.baseUrl + "/collab/add-space-member", data);
	}

	deleteSpaceMember(data) {
		return this.http.put(this.baseUrl + "/collab/delete-space-member", data);
	}

	searchSpaceMember(email) {
		return this.http.get(this.baseUrl + "/collab/searchSpaceMember", { params: email });
	}

	inviteSpaceMember(data) {
		return this.http.put(this.baseUrl + "/collab/inviteSpaceMember", data);
	}

	//hokyun 2022-08-16
	addSpaceLabel(data) {
		return this.http.put(this.baseUrl + "/collab/add-space-label", data).subscribe((res: any) => {
			this.getSpaceMembers(res.spaceTime);
		});
	}

	deleteSpaceLabel(data) {
		return this.http.put(this.baseUrl + "/collab/delete-space-label", data).pipe(
			tap(async (res: any) => {
				// this.getSpaceMembers(res.spaceTime).subscribe((res: any) => {

				// })
				this.member.set(res.spaceMembers);
				// await this.scrumService.updateScrumBoard(res.scrumBoard);
				// await this.ddsService.updateDocs(res.spaceDocs);
				return res.message;
			})
		);
	}

	editSpaceLabel(data) {
		return this.http.put(this.baseUrl + "/collab/edit-space-label", data).pipe(
			tap(async (res: any) => {
				// this.getSpaceMembers(res.spaceTime).subscribe((res: any) => {

				// })

				this.member.set(res.spaceMembers);
				// this.scrumService.updateScrumBoard(res.scrumBoard);
				// this.ddsService.updateDocs(res.spaceDocs);
				return res.message;
			})
		);
	}
}
