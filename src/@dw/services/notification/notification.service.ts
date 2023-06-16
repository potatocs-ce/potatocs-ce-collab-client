import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { NotificationStorageService } from 'src/@dw/store/notification-storage.service';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	constructor(
		private http: HttpClient,
		private notificationStorageService: NotificationStorageService,
	) { }

    getNotification(){
        return this.http.get('/api/v1/notification/get')
        .pipe(
			tap( 
				(res: any) => {
                    this.notificationStorageService.updateMyNotificationLeave(res.notification);
					return res.result = true;
				}
			)
		);
    }
    editNotification(item){
        return this.http.post('/api/v1/notification/edit', item)
        .pipe(
            tap(
                (res: any) => {
                    this.notificationStorageService.updateMyNotificationLeave(res.notification);
                    return res.result = true;
                }
            )
        )
    }
    allReadNotification(){
        return this.http.get('/api/v1/notification/allRead')
        .pipe(
            tap(
                (res: any) => {
                    this.notificationStorageService.updateMyNotificationLeave(res.notification);
                    return res.result = true;
                }
            )
        )
    }
}
