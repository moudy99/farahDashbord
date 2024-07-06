import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private chatHubConnection!: signalR.HubConnection;
  private notificationHubConnection!: signalR.HubConnection;
  private messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private get token() {
    return (
      sessionStorage.getItem('token') || localStorage.getItem('token') || ''
    );
  }

  // Start Chat Hub Connection
  public startChatHubConnection = () => {
    this.chatHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44322/chathub', {
        accessTokenFactory: () => this.token,
      })
      .build();

    this.chatHubConnection
      .start()
      .then(() => console.log('Chat Hub Connection started'))
      .catch((err) =>
        console.log('Error while starting chat hub connection: ' + err)
      );
  };

  public addTransferMessageListener = () => {
    this.chatHubConnection.on('ReceiveMessage', (message) => {
      this.messages.next([...this.messages.value, message]);
    });
  };

  public sendMessage(message: string, receiverId: string) {
    const token =
      sessionStorage.getItem('token') || localStorage.getItem('token');
    const dto = {
      ReceiverId: receiverId,
      Message: message,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post(`${environment.baseUrl}/chat/send-message`, dto, { headers })
      .subscribe(
        () => {
          console.log('Message sent successfully');
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
  }

  public getMessages() {
    return this.messages.asObservable();
  }

  // Start Notifications Hub Connection
  public startNotificationsHubConnection = () => {
    this.notificationHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44322/notificationHub', {
        accessTokenFactory: () => this.token,
      })
      .build();

    this.notificationHubConnection
      .start()
      .then(() => this.toastr.info('تم الاتصال بمركز الإشعارات', 'تم الاتصال'))
      .catch((err) =>
        console.log('Error while starting notification hub connection: ' + err)
      );
  };

  public newOwnerRegister = (callback: (data: any) => void): void => {
    this.notificationHubConnection.on('newOwnerRegister', (data) => {
      callback(data);
    });
  };
  public newServiceAdded = (callback: (data: any) => void): void => {
    this.notificationHubConnection.on('newServicesAdded', (data) => {
      console.log('newServicesAdded event received:', data);
      callback(data);
    });
  };
}
