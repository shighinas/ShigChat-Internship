import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  private subsriptions: Subscription[] = [];
  public chatroom: String|null = '' ;
  message = '';
  chats: any[] = [];
  block:boolean = false;
  mute:boolean = false;
  constructor(private messageservice: MessageService, private route:ActivatedRoute) {

    this.subsriptions.push(this.messageservice.changechatroom.subscribe(name =>{
      this.chatroom = name;
    }))

    this.messageservice.getChats().subscribe((data: any) => {
      this.chats = data;
      window.setTimeout(() => {
        const elem = document.getElementById('scrolldiv');
        elem!.scrollTop = elem?.scrollHeight as number;
      }, 500);
    });

  }

  ngOnInit(): void {
    this.subsriptions.push(
      this.route.paramMap.subscribe(params =>{
        const chatname = params.get('chatname');
        this.messageservice.changechatroom.next(chatname);
      })
    )
  }

  ngOnDestroy(): void {
    this.subsriptions.forEach( (sub)=> sub.unsubscribe());
  }

  username = sessionStorage.getItem("user");
  addChat() {
    if (this.message.length === 0) {
      return;
    }
    console.log(this.message);
    this.messageservice.addChat(this.message);
    this.message = '';
  }

  blockToggle() {
    this.block = !this.block;
  }
  muteToggle() {
    this.mute = !this.mute;
  }
}
