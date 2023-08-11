import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { ChatStorageService } from 'src/@dw/store/chat-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
    private ChatStorageService: ChatStorageService,
  ) { }

  getChat() {
    return this.http.get('/api/v1/Chat/get')
      .pipe(
        tap(
          (res: any) => {
            this.ChatStorageService.updateMyChatLeave(res.Chat);
            return res.result = true;
          }
        )
      );
  }
  editChat(item) {
    return this.http.post('/api/v1/Chat/edit', item)
      .pipe(
        tap(
          (res: any) => {
            this.ChatStorageService.updateMyChatLeave(res.Chat);
            return res.result = true;
          }
        )
      )
  }
  allReadChat() {
    return this.http.get('/api/v1/Chat/allRead')
      .pipe(
        tap(
          (res: any) => {
            this.ChatStorageService.updateMyChatLeave(res.Chat);
            return res.result = true;
          }
        )
      )
  }
}
