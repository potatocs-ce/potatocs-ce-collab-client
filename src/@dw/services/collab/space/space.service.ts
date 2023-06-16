import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MemberDataStorageService } from '../../../store/member-data-storage.service';
import { DocDataStorageService } from '../../../store/doc-data-storage.service';
import { ScrumBoardStorageService } from 'src/@dw/store/scrumBoard-storage.service';

@Injectable({
	providedIn: 'root'
})
export class SpaceService {

	constructor(
		private http: HttpClient,
		private mdsService: MemberDataStorageService,
		private ddsService: DocDataStorageService,
		private scrumService: ScrumBoardStorageService,
	) { }

	getSpaceMembers(spaceTime) {
		return this.http.get('/api/v1/collab/space/' + spaceTime)
		.pipe(
			tap(
				(res: any) => {
                    console.log(res.scrumBoard);
					console.log(res.spaceDocs);
                    console.log(res.spaceMembers)
					this.mdsService.updateMembers(res.spaceMembers);
					this.scrumService.updateScrumBoard(res.scrumBoard);
					this.ddsService.updateDocs(res.spaceDocs);
					return res.message;
				}
			)
		);
	}
	changeSpaceName(data){
		// { params: data }
		return this.http.put('/api/v1/collab/change-space-name', data );
	}
	changeSpaceBrief(data){
		return this.http.put('/api/v1/collab/change-space-brief', data);
	}
	deleteSpaceMember(data){
		return this.http.put('/api/v1/collab/delete-space-member', data);
	}
	quitSpaceAdmin(data){
		return this.http.put('/api/v1/collab/quit-space-admin', data);
	}
	addSpaceAdmin(data){
		return this.http.put('/api/v1/collab/add-space-member', data);
	}
	deleteSpace(spaceTime){
		return this.http.delete('/api/v1/collab/deleteSpace', {params: spaceTime});
	}
	// getAllMember(){
	// 	return this.http.get('/api/v1/collab/getAllMember');
	// }
	searchSpaceMember(email){
		return this.http.get('/api/v1/collab/searchSpaceMember', {params: email})
	}

	inviteSpaceMember(data){
		return this.http.put('/api/v1/collab/inviteSpaceMember', data);
	}

    //hokyun 2022-08-16
    addSpaceLabel(data){
        return this.http.put('/api/v1/collab/add-space-label',data).subscribe((res:any) =>{
            this.getSpaceMembers(res.spaceTime);
        })
    }

    deleteSpaceLabel(data){
        return this.http.put('/api/v1/collab/delete-space-label', data).pipe(
            tap(
                async(res: any) => {
                    // this.getSpaceMembers(res.spaceTime).subscribe((res: any) => {
                        
                    // })
                    this.mdsService.updateMembers(res.spaceMembers);
					// await this.scrumService.updateScrumBoard(res.scrumBoard);
					// await this.ddsService.updateDocs(res.spaceDocs);
                    return res.message;
                }
            )
        )
    }

    editSpaceLabel(data){
        return this.http.put('/api/v1/collab/edit-space-label', data).pipe(
            tap(
                async(res: any) => {
                    // this.getSpaceMembers(res.spaceTime).subscribe((res: any) => {
                        
                    // })

                    this.mdsService.updateMembers(res.spaceMembers);
					// this.scrumService.updateScrumBoard(res.scrumBoard);
					// this.ddsService.updateDocs(res.spaceDocs);
                    return res.message
                }
            )
        )
    }
}