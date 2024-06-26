import { Component, OnInit } from '@angular/core';
import { SignalrService } from 'src/app/Service/signalr.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  message: string = '';
  receiverId: string = '';
  messages: any[] = []; // Change to any[] to handle complex message objects

  constructor(private signalrService: SignalrService) {}

  ngOnInit() {
    this.signalrService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage() {
    this.signalrService.sendMessage(this.message, this.receiverId);
    this.message = '';
  }
}
