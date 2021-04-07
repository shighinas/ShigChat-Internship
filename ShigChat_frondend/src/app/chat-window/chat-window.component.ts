import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChatComponent } from '../chat/chat.component';
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
  constructor(private messageservice: MessageService, private route:ActivatedRoute, private userservice: UserService, private chat: ChatComponent) {

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

        this.chat.friends.forEach(element => {
          if(element.name==this.chatroom){
            console.log('friend Details-',element)
            this.block=element.isBlocked;
            this.mute=element.isMuted;
          }
        });
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
              },(err) => console.log(err)
     )}
     else {
      this.messageservice.addChat({message: this.message, image: null});
     }
  }

  blockToggle() {
    if(!this.block) {
      var res=confirm('Block '+ this.chatroom +' ? Blocked contacts will no longer be able to send you messages.');
    }else {
      var res=confirm('UnBlock '+ this.chatroom +' ? ');
    }

    if(res) {
      this.block = !this.block;
      console.log('blocking '+ this.chatroom+ ' by '+this.chat.currUser);
      this.userservice.blockUser(this.chat.currUser, this.chatroom, this.block)
      .subscribe((res) => {
        console.log('Blocked!');
      })
    }
  }
  muteToggle() {
    if(!this.mute) {
      var res=confirm('Do you really want to mute '+ this.chatroom +' ? ');
    }else {
      var res=confirm('Unmute '+ this.chatroom +' ? ');
    }
    if(res) {
      this.mute = !this.mute;
      this.userservice.muteUser(this.chat.currUser, this.chatroom, this.mute)
      .subscribe( (res)=>{
        console.log("Muted/Unmuted!");
      });
    }
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
