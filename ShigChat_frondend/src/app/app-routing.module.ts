import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: "reg", component: RegisterComponent},
  {path:"", component:LoginComponent},
  {path:"chat", canActivate:[AuthGuard], children: [{path:'',component:ChatComponent},
                {path:':chatname',component:ChatComponent},
                ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
