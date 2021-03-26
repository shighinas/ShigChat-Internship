import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public changechatroom = new BehaviorSubject<String | null>(null);
  // create socket property
  socket = io('http://localhost:2000', { transports : ['websocket'] });
  _chats : string[] = [];
  _chatssub : any;

  constructor() {
    this._chatssub = new Subject<any[]>();
    this.socket.on("connect", () => {
      console.log("connected to the server");
    });

    this.socket.on('message recieved', (data)=>{
      this._chats.push(data);
      this._chatssub.next([...this._chats]);
    });

    this.socket.on('all messages', (data)=>{
      this._chats = [...data];
      this._chatssub.next([...this._chats]);
    });
   }

  addUser(user: string) {
    this.socket.emit('new user', user);
  }

  addChat(message: string) {
    this.socket.emit('new message', message);
  }

   getChats() {
     return this._chatssub.asObservable();
   }
}
