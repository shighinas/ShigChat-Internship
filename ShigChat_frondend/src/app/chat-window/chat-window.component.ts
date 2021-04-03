import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  format: string = 'dd/MM/yyyy hh:mm';
  private subsriptions: Subscription[] = [];
  public chatroom: String|null = '' ;
  message = '';
  chats: any[] = [];
  block:boolean = false;
  mute:boolean = false;
  images:any;
  updatedImage:any;
  newMessage='';
  constructor(private messageservice: MessageService, private route:ActivatedRoute, private userservice: UserService) {

    this.subsriptions.push(this.messageservice.changechatroom.subscribe(name =>{
      this.chatroom = name;
    }))

    this.messageservice.getChats().subscribe((data: any) => {
      console.log(data);
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
        this.messageservice.addReceiver(this.chatroom);
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

    if(this.images){
      const formData = new FormData();
      formData.append('file', this.images);
      console.log(formData.get('file'));
     this.userservice.uploadImage(formData)
     .subscribe((res) => {
                console.log(res)
                this.images='';
                this.updatedImage=res.filename;
                console.log("new message passing "+ this.message+this.updatedImage);
                this.messageservice.addChat({message: this.message, image: this.updatedImage});
                // this._socket.emit('sendMessage', {room: this.room, message:this.newMessage, from: this.username,to:this.toUser,image:this.updatedImage,isForwarded:false});
              },(err) => console.log(err)
     )}
     else {
      this.messageservice.addChat({message: this.message, image: null});
     }
  }

  blockToggle() {
    var res=confirm('Block '+ this.chatroom +' ? Blocked contacts will no longer be able to send you messages.');
    if(res) {
      this.block = !this.block;
    }
  }
  muteToggle() {
    this.mute = !this.mute;
  }

  selectImage(event:any) {
    console.log("selecting image" + event.target.files.length)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      console.log("image selected : " + this.images)
    }
  }
}
