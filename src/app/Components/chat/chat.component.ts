import { Component, OnInit } from '@angular/core';

interface Message {
  text: string;
  time: Date;
  isMine: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  chatPartner = {
    name: 'أحمد',
    imageUrl: 'https://via.placeholder.com/40',
  };

  myImageUrl = 'https://via.placeholder.com/40';
  newMessage = '';
  messages: Message[] = [
    { text: 'مرحباً، كيف حالك؟', time: new Date(), isMine: false },
    { text: 'أنا بخير، شكراً! ماذا عنك؟', time: new Date(), isMine: true },
  ];

  constructor() {}

  ngOnInit(): void {}

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        time: new Date(),
        isMine: true,
      });
      this.newMessage = '';
    }
  }

  sendAttachment(): void {
    // وظيفة لإرسال مرفقات مثل الصور
  }
}
