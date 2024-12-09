import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../../services/chat/chat.service';
import { ProfilesService } from '../../../services/profiles/profiles.service';

@Component({
  selector: 'app-qna',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, FormsModule],
  templateUrl: './qna.component.html',
  styleUrl: './qna.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class QnaComponent {
  history: Array<any> = []; // 대화 내역 저장용 
  chatHistory: Array<any> = [];
  qustion: string = ''; // 질문 
  company: string = ''; // 회사 

  waiting: boolean = false;
  maxRows: number = 8;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;


  userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;

  constructor(
    private chatService: ChatService,
    private profilesService: ProfilesService
  ) { }

  /**
   * 질문용 함수 
   */
  submit() {
    if (this.waiting) return;

    this.waiting = true;
    const temp = [];
    this.chatService.ask(this.qustion, this.chatHistory, this.userCompanyInfo()._id).subscribe((res: any) => {
      if (res.status) {
        this.history.push('<article class="answer">' + res.answer.kwargs.content + '</article>')
        temp.push(res.answer.kwargs.content)

      }
      this.waiting = false;
    })
    this.history.push('<article class="question">' + this.qustion + '</article>');
    temp.push(this.qustion)
    this.qustion = '';
    this.chatHistory.push(temp);
  }


  handleKeyDown(event: KeyboardEvent) {
    const textarea = this.textarea.nativeElement;


    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit()
    } else if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      this.insertAtCursor('\n');
    }

    if (textarea.scrollHeight < 216) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }


  insertAtCursor(value: string) {
    const textarea = this.textarea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value = textarea.value.substring(0, start) + value + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + value.length;
  }
}
