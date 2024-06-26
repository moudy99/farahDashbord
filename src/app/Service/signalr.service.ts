import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messages: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );
  private apiUrl: string = 'https://localhost:44322/api/Chat/send-message';

  constructor(private http: HttpClient) {
    this.startConnection();
    this.addTransferMessageListener();
  }

  private get token() {
    return (
      sessionStorage.getItem('token') || localStorage.getItem('token') || ''
    );
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44322/chathub', {
        accessTokenFactory: () => this.token,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addTransferMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (message) => {
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

    this.http.post(this.apiUrl, dto, { headers }).subscribe(
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
}
