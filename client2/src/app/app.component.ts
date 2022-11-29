import { Component, OnInit } from '@angular/core';
import { VirtualTimeScheduler } from 'rxjs';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'Dating App';
  users:any;

  
  constructor(private accountService: AccountService){}
  ngOnInit(): void {   
    this.setCurrentUsers();
  }
  

    setCurrentUsers(){
      const userString = localStorage.getItem('user');
      if(!userString) return;
      const user:User = JSON.parse(userString);
      this.accountService.setCurrentUsers(user);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                      
}


