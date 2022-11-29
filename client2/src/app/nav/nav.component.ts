import { Component, OnInit } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model:any = {}
// loggedIn =false;
currentUser$:Observable<User | null> = of(null)


  constructor(public accountService:AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUsers$;
  }

  // getCurrentUser(){
  //   this.accountService.currentUsers$.subscribe({
  //     next: user => this.loggedIn = !!user,
  //     error: error => console.log(error)
      
  //   })
  // }

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        // this.loggedIn=true;
      },
      error: error =>console.log(error)
    })
    console.log(this.model);
  }

  logout() {
    this.accountService.logout();
    // this.loggedIn=false;
    }
    
}
