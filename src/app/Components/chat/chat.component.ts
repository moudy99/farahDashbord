import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ChatService } from 'src/app/Service/chat.service';
import { SignalrService } from 'src/app/Service/signalr.service';
import { environment } from 'src/environments/environment.development';

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

  chatId: number = 0;
  chatData: any;

  chatPartner = {
    name: '',
    imageUrl: '',
  };

  myImageUrl = 'https://via.placeholder.com/40';
  newMessage = '';
  messages: Message[] = [];
  myUserId: string = '';
  reciverId: string = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private signalrService: SignalrService
  ) {
    this.signalrService.startChatHubConnection();
  }

  ngOnInit(): void {
    this.reciverId = localStorage.getItem('customerId') || ''; // Default to empty string if null
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.myUserId = decodedToken.uid;
      console.log(decodedToken.uid);
    }

    this.route.params.subscribe((params) => {
      this.chatId = +params['id'];
      this.loadChat(this.chatId);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const newMessage: Message = {
        text: this.newMessage,
        time: new Date(),
        isMine: true,
        isCollapsed: true,
      };
      this.messages.push(newMessage);
      this.newMessage = '';
      this.scrollToBottom();
      this.signalrService.sendMessage(newMessage.text, this.reciverId); // Send message via SignalrService
    }
  }

  sendAttachment(): void {
    // Implement attachment functionality if needed
  }

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

  loadChat(chatId: number): void {
    this.chatService.getChatById(chatId).subscribe(
      (response: any) => {
        console.log(response);
        this.chatData = response.data;
        this.chatPartner.name = response.data.user.userName;
        this.chatPartner.imageUrl = `${environment.UrlForImages}${response.data.user.profileImage}`;
        this.messages = response.data.messages.map((msg: any) => ({
          text: msg.message,
          time: new Date(msg.sentAt),
          isMine: msg.senderId === this.myUserId,
          isCollapsed: true,
        }));
      },
      (error: any) => {
        console.error('Error fetching chat data', error);
      }
    );
  }
}
