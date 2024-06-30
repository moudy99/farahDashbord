import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';

interface Message {
  text: string;
  time: Date;
  isMine: boolean;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody', { static: false }) private chatBody!: ElementRef;

  chatPartner = {
    name: 'Moudy Rasmy',
    imageUrl: 'https://via.placeholder.com/40',
  };

  myImageUrl = 'https://via.placeholder.com/40';
  newMessage = '';
  messages: Message[] = [
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    {
      text: 'اهلااهلااهلااهلا',
      time: new Date(),
      isMine: true,
      isCollapsed: true,
    },
    {
      text: 'اهلااهلااهلا',
      time: new Date(),
      isMine: false,
      isCollapsed: true,
    },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    {
      text: 'اهلااهلااهلااهلااهلااهلا',
      time: new Date(),
      isMine: true,
      isCollapsed: true,
    },
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
    {
      text: 'اهلااهلااهلااهلااهلا',
      time: new Date(),
      isMine: false,
      isCollapsed: true,
    },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: false, isCollapsed: true },
    { text: 'اهلا', time: new Date(), isMine: true, isCollapsed: true },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        time: new Date(),
        isMine: true,
        isCollapsed: true,
      });
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  sendAttachment(): void {}

  toggleMessage(message: Message): void {
    message.isCollapsed = !message.isCollapsed;
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
