import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { ChatService } from 'src/app/Service/chat.service';
import { SignalrService } from 'src/app/Service/signalr.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  message: string = '';
  receiverId: string = '';
  AllCHats: any[] = [];
  myUserId: string = '';

  constructor(
    private signalrService: SignalrService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.getAllMessages(1, 12);
  }

  getAllMessages(page: number, pageSize: number) {
    this.chatService.getAllChats(page, pageSize).subscribe(
      (data) => {
        console.log(data);
        this.AllCHats = data.data;
        console.log(this.AllCHats);
      },
      (err) => console.log(err)
    );
  }
  sendMessage() {
    this.signalrService.sendMessage(this.message, this.receiverId);
    this.message = '';
  }
}
