import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/Service/chat.service';
import { Chat } from './../../Interfaces/chat';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TimeFormatService } from 'src/app/Service/time-format.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  AllCHats: Chat[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  myUserId: string = '';
  itemsPerPage: number = 10;
  pages: number[] = [];
  customerId: string = '';

  constructor(
    private chatService: ChatService,
    private router: Router,
    private FormatTime: TimeFormatService
  ) {}

  ngOnInit(): void {
    this.myUserId = this.getCurrentUserId();
    this.loadChats(this.currentPage);
  }

  loadChats(page: number): void {
    this.chatService
      .getAllChats(page, this.itemsPerPage)
      .subscribe((response: any) => {
        console.log(response);
        this.AllCHats = response.data.map((chat: Chat) => ({
          ...chat,
          user: {
            ...chat.user,
            profileImage: `${environment.UrlForImages}/${chat.user.profileImage}`,
          },
          lastMessageSentAtFormatted: this.FormatTime.formatingTime(
            new Date(chat.lastMessageSentAt)
          ),
        }));
        this.totalPages = response.paginationInfo.totalPages;
        this.pages = Array(this.totalPages)
          .fill(0)
          .map((x, i) => i + 1);
      });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadChats(this.currentPage);
    }
  }

  goToMessage(chatId: any, userId: string): void {
    this.router.navigate(['/orders/chat', chatId]);
    localStorage.setItem('customerId', userId);
    sessionStorage.setItem('customerId', userId);
  }

  getCurrentUserId(): string {
    return 'current-user-id';
  }
}
