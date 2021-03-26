import { Component, OnInit } from '@angular/core';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  currUser: any = "";
  allusers :any[] = [];
  friends: Array<{name:string,isMuted: boolean, isBlocked: boolean}> = [];
  constructor(private messageservice: MessageService, private userservice:UserService) { }

  ngOnInit(): void {
    this.currUser = sessionStorage.getItem('user');
    this.userservice.allusers().subscribe((users:any)=>{
      this.allusers = users;
    });
    this.userservice.allfriends(sessionStorage.getItem('userid')).subscribe((data)=>{
      this.friends = JSON.parse(JSON.stringify(data));
      console.log(this.friends);
    })
  }

  addContact(user: String) {
    var ans = confirm('Do you want to add '+ user + ' to your contact?');
    if (ans) {
        this.userservice.addcontact(sessionStorage.getItem('userid'), user)
        .subscribe((res) => {
          console.log('Successfully added to contact!');
        })
        this.ngOnInit();
    }
  }

  onClickchange() {
    
  }

}
