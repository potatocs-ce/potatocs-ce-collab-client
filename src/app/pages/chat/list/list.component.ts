import { CommonModule } from '@angular/common';
import { Component, effect, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialsModule } from '../../../materials/materials.module';
import { ChatService } from '../../../services/chat/chat.service';
import { ProfilesService } from '../../../services/profiles/profiles.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule, RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  listData: any = [];
  listDataBackup: any = [];
  // 
  loading: boolean = false;
  isAscending: boolean = true;

  searchValue: string = '';

  constructor(
    private chatService: ChatService,
    private profilesService: ProfilesService,
    private dialogService: DialogService
  ) {
    const effectRef = effect(() => {
      if (this.userProfileInfo() && this.userCompanyInfo()) {
        this.refresh();
        effectRef.destroy();
      }

    }, { manualCleanup: true })
  }

  userCompanyInfo: WritableSignal<any> = this.profilesService.userCompanyInfo;
  userProfileInfo: WritableSignal<any> = this.profilesService.userProfileInfo;

  // 새로고침
  refresh() {
    this.loading = true;
    this.chatService.getList(this.userCompanyInfo()._id, this.userProfileInfo()._id).subscribe((res: any) => {
      this.listData = res;
      this.listDataBackup = this.listData;
      this.loading = false;
    })
  }

  // 정렬
  sort() {
    this.isAscending = !this.isAscending;
    this.listData = this.listData.sort((a: any, b: any) => {
      const dataA: any = new Date(a.createdAt);
      const dataB: any = new Date(b.createdAt);

      if (this.isAscending) {
        return dataA - dataB;
      } else {
        return dataB - dataA;
      }
    })
  }

  // 검색
  search() {
    this.listData = this.listDataBackup.filter((item: any) => item.originalFileName.includes(this.searchValue));
  }


  // 새 창에서 열기
  open(key: string) {

    this.chatService.getDoc(key).subscribe({
      next: (response) => {
        const fileBlob = response.body;
        if (fileBlob) {
          const fileUrl = URL.createObjectURL(fileBlob);
          window.open(fileUrl, "_blank");
        }
      },
      error: (err) => {
        console.error("Error fetching document:", err);
      }
    });
  }

  // 삭제
  delete(_id: string) {
    this.dialogService.openDialogConfirm('Do you want delete this file?').subscribe((res: any) => {
      if (res) {
        this.chatService.deleteDoc(_id).subscribe({
          next: (response) => {
            console.log(response);
            this.refresh();
          },
          error: (err) => {
            console.error("Error deleting document", err);
          }
        })
      }
    })

  }
}
