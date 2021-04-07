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
  statusOnline: string[] = [];

  constructor() {
    this._chatssub = new Subject<any[]>();
    this.socket.on("connect", () => {
      console.log("connected to the server");
    });

    this.socket.on('message recieved', (data)=>{
      console.log("messages" + data.messages);
      this._chats.push(data);
      this._chatssub.next([...this._chats]);
    });

    this.socket.on('all messages', (data)=>{
      console.log("messages" + data);
      this._chats = [...data];
      this._chatssub.next([...this._chats]);
    });

    this.socket.on('user connected', (data) => {
      console.log("connected user "+ data);
      this.statusOnline.push(data);
      console.log(this.statusOnline);
    });
    this.socket.on('user disconnected', (data) => {
      console.log("disconnected user "+ data);
      let pos = this.statusOnline.indexOf(data);
      this.statusOnline.splice(pos, 1);
      console.log(this.statusOnline);
    });
   }

  addUser(user: any) {
    this.socket.emit('new user', user);
  }

  addReceiver(receiver : any) {
    this.socket.emit('receiver', receiver);
  }

  addChat(message: any) {
    this.socket.emit('new message', message);
  }

   getChats() {
     return this._chatssub.asObservable();
   }

}
